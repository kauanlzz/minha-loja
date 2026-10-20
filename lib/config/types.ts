import type { NextConfig } from "next";

export interface ShopConfig {
  localization: {
    locale: string;
  };
  site: {
    description: string;
    name: string;
    url: string;
  };
}

export interface NextConfigContext {
  defaultConfig: NextConfig;
}

export type NextConfigFactory = (
  phase: string,
  context: NextConfigContext,
) => NextConfig | Promise<NextConfig>;

export type NextConfigInput = NextConfig | NextConfigFactory;

export type NextConfigPlugin = (config: NextConfig) => NextConfigInput | Promise<NextConfigInput>;
