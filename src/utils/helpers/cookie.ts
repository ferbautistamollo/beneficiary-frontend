"use server";

import { cookies } from "next/headers";

import { ResponseData } from "@/utils/interfaces";

export async function getCookie(nameCookie: string): Promise<any> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(nameCookie);

  if (!cookie) {
    return undefined;
  }

  return cookie.value;
}

export async function getUserCookie(): Promise<ResponseData> {
  try {
    const cookie = await getCookie("user");

    if (!cookie) {
      return {
        error: true,
        message: "No se encontró la cookie 'user'",
      };
    }

    return {
      error: false,
      message: "Cookie 'user' obtenida exitosamente",
      data: JSON.parse(cookie),
    };
  } catch (error) {
    return {
      error: true,
      message: "Error al obtener la cookie 'user': " + error,
    };
  }
}

export async function getAccessCookie(): Promise<ResponseData> {
  try {
    const cookie = await getCookie("access");

    if (!cookie) {
      return {
        error: true,
        message: "No se encontró la cookie 'access'",
      };
    }

    return {
      error: false,
      message: "Cookie 'access' obtenida exitosamente",
      data: JSON.parse(cookie),
    };
  } catch (error) {
    return {
      error: true,
      message: "Error al obtener la cookie 'access': " + error,
    };
  }
}
