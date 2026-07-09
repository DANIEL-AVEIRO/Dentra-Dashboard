import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import client from "@/api/client";
import { DEFAULT_BRAND, normalizeBrandPayload } from "@/constants/brand";
import { applyBrandCssVars } from "@/utils/brandPalette";
import { getStoredBrand, setStoredBrand } from "@/utils/brandStorage";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const BrandContext = createContext(null);

function readInitialBrand() {
  const cached = getStoredBrand();
  const brand = normalizeBrandPayload(cached || {});
  applyBrandCssVars(brand);
  return brand;
}

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(readInitialBrand);
  const [loading, setLoading] = useState(() => !getStoredBrand());

  const applyBrand = useCallback((nextBrand) => {
    const normalized = normalizeBrandPayload(nextBrand);
    setStoredBrand(normalized);
    applyBrandCssVars(normalized);
    setBrand(normalized);
    return normalized;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { data } = await client.get("/brand/", { skipTopLoader: true });
      applyBrand(data);
    } catch {
      if (!getStoredBrand()) {
        applyBrand({});
      }
    } finally {
      setLoading(false);
    }
  }, [applyBrand]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logoUrl = useMemo(() => {
    if (brand.logo) return resolveMediaUrl(brand.logo) || brand.logo;
    return DEFAULT_BRAND.logoFallback;
  }, [brand.logo]);

  const value = useMemo(
    () => ({
      brand,
      colors: {
        primary: brand.primary,
        secondary: brand.secondary,
        dark: brand.dark,
        darker: brand.darker,
        white: brand.white,
      },
      logoUrl,
      loading,
      refresh,
      setBrand: applyBrand,
    }),
    [brand, logoUrl, loading, refresh, applyBrand]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export const useBrand = () => {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return ctx;
};
