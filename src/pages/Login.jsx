import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { Box, InputAdornment, useTheme } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import ActionButton from "@/components/common/ActionButton";
import { ProTextField } from "@/components/common/form";
import { inputAdornmentSx } from "@/components/common/form/fieldStyles";
import { APP_TITLE } from "@/constants/brand";
import { useBrand } from "@/context/BrandContext";
import { toast, getErrorMessage } from "@/utils/toast";
import "@/styles/login.css";

/** Clinic → case → lab hub → delivery workflow diagram */
function LoginDentalFlow() {
  return (
    <svg className="login-hero__flow" viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g className="login-hero__flow-lines">
        <path className="login-hero__flow-line login-hero__flow-line--accent" d="M 400 318 V 402" />
        <path className="login-hero__flow-line" d="M 248 450 H 352" />
        <path className="login-hero__flow-line" d="M 448 450 H 552" />
        <path className="login-hero__flow-line" d="M 400 498 V 582" />
        <path className="login-hero__flow-line login-hero__flow-line--soft" d="M 248 450 V 582 H 552" />
      </g>

      <rect className="login-hero__flow-node login-hero__flow-node--clinic" x="364" y="290" width="72" height="56" rx="14" />
      <rect className="login-hero__flow-node" x="176" y="422" width="72" height="56" rx="12" />
      <rect className="login-hero__flow-node login-hero__flow-node--hub" x="364" y="422" width="72" height="56" rx="12" />
      <rect className="login-hero__flow-node login-hero__flow-node--lab" x="552" y="422" width="72" height="56" rx="12" />
      <rect className="login-hero__flow-node" x="364" y="554" width="72" height="56" rx="12" />

      <circle className="login-hero__flow-dot login-hero__flow-dot--accent" cx="400" cy="318" r="4" />
      <circle className="login-hero__flow-dot" cx="248" cy="450" r="4" />
      <circle className="login-hero__flow-dot login-hero__flow-dot--pulse" cx="400" cy="450" r="5" />
      <circle className="login-hero__flow-dot" cx="552" cy="450" r="4" />
      <circle className="login-hero__flow-dot" cx="400" cy="582" r="4" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { logoUrl } = useBrand();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  useDocumentTitle(t("auth.signIn"));

  const heroFeatures = [
    {
      icon: LocalHospitalOutlinedIcon,
      title: t("auth.featureClinicTitle"),
      desc: t("auth.featureClinicDesc"),
    },
    {
      icon: ScienceOutlinedIcon,
      title: t("auth.featureLabTitle"),
      desc: t("auth.featureLabDesc"),
    },
    {
      icon: ReceiptLongOutlinedIcon,
      title: t("auth.featureFinanceTitle"),
      desc: t("auth.featureFinanceDesc"),
    },
  ];

  const mobilePills = [
    { icon: LocalHospitalOutlinedIcon, label: t("auth.featureClinicTitle") },
    { icon: ScienceOutlinedIcon, label: t("auth.featureLabTitle") },
    { icon: AssessmentOutlinedIcon, label: t("auth.featureFinanceTitle") },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t("auth.welcomeToast"));
      navigate("/");
    } catch (err) {
      toast.error(getErrorMessage(err, t("auth.loginFailed")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-page fade-in">
      <Box component="section" className="login-hero" aria-hidden={false}>
        <Box className="login-hero__grid" aria-hidden />
        <Box className="login-hero__glow login-hero__glow--a" aria-hidden />
        <Box className="login-hero__glow login-hero__glow--b" aria-hidden />
        <LoginDentalFlow />

        <Box className="login-hero__content">
          <Box className="login-hero__badge">
            <span className="login-hero__badge-dot" aria-hidden />
            {t("auth.adminPortal")}
          </Box>

          <h1 className="login-hero__title">{t("auth.heroTitle")}</h1>
          <p className="login-hero__tagline">{t("auth.heroDescription")}</p>

          <Box className="login-hero__features">
            {heroFeatures.map(({ icon: Icon, title, desc }) => (
              <Box key={title} className="login-feature">
                <Box className="login-feature__icon">
                  <Icon />
                </Box>
                <Box>
                  <p className="login-feature__title">{title}</p>
                  <p className="login-feature__desc">{desc}</p>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box component="section" className="login-panel">
        <Box className="login-panel__dots" aria-hidden />

        <Box className="login-panel__brand">
          <Box
            component="img"
            src={logoUrl}
            alt={APP_TITLE}
            className="login-panel__logo"
          />
          <Box component="span" className="login-panel__badge login-panel__badge--mobile">
            <span className="login-hero__badge-dot" aria-hidden />
            {t("auth.adminPortal")}
          </Box>
        </Box>

        <Box className="login-card page-enter">
          <Box className="login-card__secure">
            <VerifiedUserOutlinedIcon />
            {t("auth.secureBadge")}
          </Box>

          <h2 className="login-card__title">{t("auth.welcomeBack")}</h2>
          <p className="login-card__subtitle">{t("auth.signInSubtitle")}</p>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <ProTextField
              fullWidth
              label={t("auth.email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={inputAdornmentSx(theme, "start")}>
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <ProTextField
              fullWidth
              label={t("auth.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={inputAdornmentSx(theme, "start")}>
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <ActionButton
              fullWidth
              type="submit"
              intent="auth"
              size="large"
              loading={loading}
              sx={{ py: 1.6, fontSize: "1rem" }}
            >
              {loading ? t("auth.signingIn") : t("auth.signIn")}
            </ActionButton>
          </Box>

          <p className="login-card__footer">
            © {new Date().getFullYear()} {APP_TITLE}
          </p>
        </Box>

        <Box className="login-mobile-pills" aria-label={t("auth.tagline")}>
          {mobilePills.map(({ icon: Icon, label }) => (
            <span key={label} className="login-mobile-pill">
              <Icon />
              {label}
            </span>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
