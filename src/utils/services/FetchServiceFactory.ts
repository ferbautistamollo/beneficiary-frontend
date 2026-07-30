import { APIConnection } from "./APIConnection";
import { APIConnectionFactory } from "./APIConnectionFactory";
import { FetchService } from "./FetchService";

import { checkIp } from "@/utils/helpers/ip";

export class FetchServiceFactory extends APIConnectionFactory {
  private baseUrl: string;

  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
  }

  public createAPIConnection(): APIConnection {
    return new FetchService(this.baseUrl);
  }
}

const host = process.env.NEXT_PUBLIC_BACKEND_HOST || "localhost";
const port = process.env.NEXT_PUBLIC_BACKEND_PORT || 3000;
const baseUrl = `http://${host}:${port}/api/`;
const factory = new FetchServiceFactory(baseUrl);

export const apiClient = factory.createAPIConnection();

export const apiClientBiometric = async () => {
  const ip = await checkIp();
  const biometricHost = ip || "localhost";
  const biometricPort = process.env.NEXT_PUBLIC_BIOMETRIC_PORT || 8899;
  const baseUrlBiometric = `http://${biometricHost}:${biometricPort}/api/`;
  const biometricFactory = new FetchServiceFactory(baseUrlBiometric);

  return biometricFactory.createAPIConnection();
};

const hostLogin = process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost";
const portLogin = process.env.NEXT_PUBLIC_LOGIN_FRONTEND_PORT || 3001;

export const urlLogin = `http://${hostLogin}:${portLogin}`;
