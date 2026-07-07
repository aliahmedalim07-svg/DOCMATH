import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../contexts/I18nContext";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for exit animation to finish
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ziad-primary"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 0.2, scale: 1 }}
               transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
               className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-ziad-accent blur-3xl" 
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 0.1, scale: 1 }}
               transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
               className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-white blur-3xl" 
            />
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
            className="relative z-10"
          >
            <picture>
              <source srcSet="/logo_no_bg@298w.webp" type="image/webp" />
              <img src="/logo_no_bg@298w.png" alt={t("altLogo")} width="298" height="112" className="h-28 w-auto rounded-card bg-white shadow-lift border border-white/20" />
            </picture>
          </motion.div>

          <div className="mt-8 relative z-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xs font-black uppercase tracking-[0.4em] text-ziad-light/75"
            >
              {t("interactiveLearning")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-2 text-4xl font-black text-white"
            >
              {t("brandDr")} <span className="text-ziad-light">Ziad Mohamed</span> Math
            </motion.h1>
          </div>

          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            className="mt-12 h-1 rounded-full bg-white/20 overflow-hidden"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
              className="h-full w-full bg-ziad-accent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

