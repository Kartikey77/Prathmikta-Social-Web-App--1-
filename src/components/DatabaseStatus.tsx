import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { testSupabaseConnection } from "../utils/initializeApp";
import { useLanguage } from "./LanguageContext";

export function DatabaseStatus() {
  const { t } = useLanguage();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testSupabaseConnection();
      setIsConnected(result.connected);
      setLastChecked(new Date());
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return "bg-gray-500";
    return isConnected ? "bg-green-500" : "bg-yellow-500";
  };

  const getStatusText = () => {
    if (isConnected === null) return t('common.loading');
    return isConnected ? t('toast.dbConnected') : t('toast.localStorage');
  };

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="w-3 h-3 animate-spin" />;
    if (isConnected === null) return <RefreshCw className="w-3 h-3" />;
    return isConnected ? <Cloud className="w-3 h-3" /> : <CloudOff className="w-3 h-3" />;
  };

  const getTooltipText = () => {
    if (isConnected === null) return t('common.loading');
    if (isConnected) {
      return `${t('toast.dbConnectedDesc')} ${lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : ''}`;
    }
    return `${t('toast.localStorageDesc')} ${lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : ''}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={checkConnection}
              disabled={isLoading}
              className="h-6 px-2 text-xs"
            >
              <Badge className={`${getStatusColor()} text-white text-xs flex items-center gap-1 border-0`}>
                {getStatusIcon()}
                <span className="hidden sm:inline">{getStatusText()}</span>
              </Badge>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-64 text-center">{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}