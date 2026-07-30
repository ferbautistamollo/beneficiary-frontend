"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

import { apiClientBiometric } from "@/utils/services";

interface Area {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  group: string;
}

interface HandsProps {
  selectedOption: string | undefined;
  fingerprints: any[];
}

const AREAS: Area[] = [
  { id: 1, name: "Pulgar Derecho", x: 565, y: 262, width: 30, height: 30, group: "Pulgares" },
  { id: 2, name: "Índice Derecho", x: 497, y: 143, width: 20, height: 30, group: "Indices" },
  { id: 3, name: "Pulgar Izquierdo", x: 105, y: 262, width: 30, height: 30, group: "Pulgares" },
  { id: 4, name: "Índice Izquierdo", x: 183, y: 143, width: 20, height: 30, group: "Indices" },
];

const NOPROCESS = "rgba(255, 255, 255, 1)";
const HOVER = "rgba(0, 90, 255, 0.4)";

const colors = {
  PROCESS: "rgba(255, 255, 0, 1)",
  REGISTERED: "rgba(0, 255, 0, 0.7)",
  UNREGISTERED: "rgba(255, 0, 0, 0.7)",
};

const LINE_COLOR = "gray";
const LINE_WIDTH = 2;

const MARKER_COLOR = "gray";
const MARKER_SIZE = 4;

const checkActionArea = (area: Area, x: number, y: number) => {
  const dx = x - (area.x + area.width / 2);
  const dy = y - (area.y + area.height / 2);

  return (
    (dx * dx) / ((area.width / 2) * (area.width / 2)) + (dy * dy) / ((area.height / 2) * (area.height / 2)) <=
    1
  );
};

const drawTextOnCanvas = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  theme: string,
) => {
  ctx.font = "500 20px 'Courier New'";
  ctx.fillStyle = theme === "dark" ? "lightgray" : "black";
  ctx.fillText(text, x, y);
};

const drawLineMarker = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  diagonalEndX: number,
  diagonalEndY: number,
  horizontalEndX: number,
) => {
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = LINE_WIDTH;
  ctx.beginPath();
  // Parte diagonal
  ctx.moveTo(startX, startY);
  ctx.lineTo(diagonalEndX, diagonalEndY);

  // Parte horizontal
  ctx.lineTo(diagonalEndX, horizontalEndX);
  ctx.stroke();
};

const drawMaker = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = MARKER_COLOR;
  ctx.beginPath();
  ctx.arc(x, y, MARKER_SIZE, 0, 2 * Math.PI);
  ctx.fill();
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y); // Mover a la esquina superior izquierda
  ctx.lineTo(x + width - radius, y); // Línea superior
  ctx.arcTo(x + width, y, x + width, y + radius, radius); // Esquina superior derecha
  ctx.lineTo(x + width, y + height - radius); // Línea derecha
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Esquina inferior derecha
  ctx.lineTo(x + radius, y + height); // Línea inferior
  ctx.arcTo(x, y + height, x, y + height - radius, radius); // Esquina inferior izquierda
  ctx.lineTo(x, y + radius); // Línea izquierda
  ctx.arcTo(x, y, x + radius, y, radius); // Esquina superior izquierda
  ctx.closePath();
};

const drawTextBox = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  status: string,
  theme: string,
) => {
  ctx.font = "600 10px 'DejaVu Sans'";
  const padding = 5;
  const boxWidth = 160;
  const boxHeight = 70;
  const radius = 5;

  ctx.fillStyle = theme === "dark" ? "#333339" : "white";
  drawRoundedRect(ctx, x - 50, y, boxWidth - 50, boxHeight, radius);
  ctx.fill();
  ctx.strokeStyle = theme === "dark" ? "#626267" : "black";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, x - 50, y, boxWidth - 50, boxHeight, radius);
  ctx.stroke();
  ctx.font = "600 11px 'DejaVu Sans'";
  ctx.fillStyle = theme === "dark" ? "white" : "black";
  ctx.fillText(text, x - 50 + padding, y + 20);
  ctx.font = "11px 'DejaVu Sans'";
  ctx.fillStyle = theme === "dark" ? "white" : "black";
  ctx.fillText("Estado:", x - 50 + padding, y + 35);
  ctx.font = "600 10px 'DejaVu Sans'";
  if (status == "Registrado") {
    ctx.fillStyle = "green";
  } else if (status == "No Registrado") {
    ctx.fillStyle = "red";
  } else {
    ctx.fillStyle = "rgba(255, 165, 0, 1)";
  }
  ctx.fillText(status, x - 35 + padding, y + 50);
};

const drawLineMarkerWithBox = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  diagonalEndX: number,
  diagonalEndY: number,
  horizontalEndX: number,
  text: string,
  status: string,
  theme: string,
) => {
  drawLineMarker(ctx, startX, startY, diagonalEndX, diagonalEndY, horizontalEndX);
  drawTextBox(ctx, diagonalEndX, horizontalEndX - 30, text, status, theme);
};

const drawLegend = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  text: string,
  theme: string,
) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 40, 10);
  ctx.strokeStyle = theme === "dark" ? "lightgray" : "black";
  ctx.lineWidth = 0.3;
  ctx.strokeRect(x, y, 40, 10);
  ctx.font = "600 11px 'Courier New'";
  ctx.fillStyle = theme === "dark" ? "lightgray" : "black";
  ctx.fillText(text, x + 45, y + 9);
};

export function Hands(props: HandsProps) {
  const { selectedOption, fingerprints } = props;
  const { theme } = useTheme();

  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [hoverArea, setHoverArea] = useState<number | null>(null);

  const drawAndPaintFingers = (area: Area, ctx: CanvasRenderingContext2D, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (area.id == 1 || area.id == 3) {
      ctx.ellipse(
        area.x + area.width / 2,
        area.y + area.height / 2,
        (area.width / 2) * 1.2,
        (area.height / 2) * 0.7,
        0,
        0,
        2 * Math.PI,
      );
    } else {
      ctx.ellipse(
        area.x + area.width / 2,
        area.y + area.height / 2,
        area.width / 2,
        area.height / 2,
        0,
        0,
        2 * Math.PI,
      );
    }
    ctx.fill();
  };

  const draw = (
    areas: any,
    ctx: CanvasRenderingContext2D,
    color: string,
    status: string,
    selectedOption?: string,
  ) => {
    const shouldShowDetail = (area: Area): boolean => {
      if (!selectedOption) return true; // mostrar todo si no hay selección
      if (selectedOption === "Pulgares" || selectedOption === "Indices") {
        return area.group === selectedOption;
      }

      return area.id.toString() === selectedOption;
    };

    areas.forEach((area: Area) => {
      const centerX = area.x + area.width / 2;
      const centerY = area.y + area.height / 2;

      if (shouldShowDetail(area)) {
        drawAndPaintFingers(area, ctx, color);
        drawMaker(ctx, centerX, centerY);

        switch (area.name) {
          case "Pulgar Derecho":
            drawLineMarkerWithBox(
              ctx,
              centerX,
              centerY,
              centerX + 50,
              245,
              centerX - 370,
              area.name,
              status,
              theme || "light",
            );
            break;
          case "Índice Derecho":
            drawLineMarkerWithBox(
              ctx,
              centerX,
              centerY,
              centerX + 80,
              100,
              centerX - 385,
              area.name,
              status,
              theme || "light",
            );
            break;
          case "Pulgar Izquierdo":
            drawLineMarkerWithBox(
              ctx,
              centerX,
              centerY,
              centerX - 65,
              240,
              centerX + 90,
              area.name,
              status,
              theme || "light",
            );
            break;
          case "Índice Izquierdo":
            drawLineMarkerWithBox(
              ctx,
              centerX,
              centerY,
              centerX - 90,
              100,
              centerX - 70,
              area.name,
              status,
              theme || "light",
            );
            break;
        }
      }
    });

    if (hoverArea !== null) {
      const hoverAreaObj = AREAS.find((area) => area.id === hoverArea);

      if (hoverAreaObj) {
        drawAndPaintFingers(hoverAreaObj, ctx, HOVER);
      }
    }
  };

  useEffect(() => {
    const img = document.getElementById("hands") as HTMLImageElement | null;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
    const ctx = canvas!.getContext("2d") as CanvasRenderingContext2D | null;

    const handleCanvasClick = (event: MouseEvent) => {
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.fillStyle = colors["REGISTERED"];

        AREAS.forEach(async (area: Area) => {
          if (checkActionArea(area, x, y)) {
            const client = await apiClientBiometric();

            client
              .GET("biometrico/capturar/huella")
              .then((response: any) => {
                console.log(response);
                setSelectedAreas((prev) => [...prev, area.id]);
              })
              .catch((error: any) => {
                throw error;
              });
          }
        });
      }
    };
    const drawAreas = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height); // borrar dibujo
        // ctx, "text", "x", "y", "theme"
        drawTextOnCanvas(ctx, "MANO IZQUIERDA", 160, 440, theme || "light");
        drawTextOnCanvas(ctx, "MANO DERECHA", 390, 440, theme || "light");

        // Dibujar leyenda
        drawLegend(ctx, 130, 450, colors["REGISTERED"], "REGISTRADO", theme || "light");
        drawLegend(ctx, 290, 450, colors["UNREGISTERED"], "NO REGISTRADO", theme || "light");
        drawLegend(ctx, 470, 450, colors["PROCESS"], "EN PROCESO", theme || "light");

        const registeredFootprints: Area[] = AREAS.filter((item1) =>
          fingerprints.some((item2) => item2.id === item1.id),
        );

        draw(registeredFootprints, ctx, colors["REGISTERED"], "Registrado", selectedOption);
        const unregisteredFootprints: Area[] = AREAS.filter(
          (item1) => !fingerprints.some((item2) => item2.id === item1.id),
        );

        draw(unregisteredFootprints, ctx, colors["UNREGISTERED"], "No Registrado", selectedOption);
        if (selectedOption) {
          const selectedFootprints: Area[] =
            selectedOption === "Pulgares" || selectedOption === "Indices"
              ? AREAS.filter((item) => item.group === selectedOption)
              : AREAS.filter((item) => item.id.toString() === selectedOption);

          draw(selectedFootprints, ctx, NOPROCESS, "", selectedOption);
          draw(selectedFootprints, ctx, colors["PROCESS"], "En proceso", selectedOption);
        }
      }
    };
    const handleMouseMove = (event: MouseEvent) => {
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        let isHovering = false;

        AREAS.forEach((area: Area) => {
          if (checkActionArea(area, x, y)) {
            setHoverArea(area.id);
            isHovering = true;
          }
        });
        if (!isHovering) {
          setHoverArea(null);
        }

        canvas.style.cursor = isHovering ? "pointer" : "default";
      }
    };
    const initializeCanvas = () => {
      if (canvas && img && ctx) {
        canvas.width = img.width + 200;
        canvas.height = img.height + 200;

        drawAreas();
        // canvas.addEventListener('click', handleCanvasClick);
        canvas.addEventListener("mousemove", handleMouseMove);
      }
    };

    if (img)
      if (img.complete) initializeCanvas();
      else img.onload = () => initializeCanvas();

    return () => {
      if (canvas) {
        canvas.removeEventListener("click", handleCanvasClick);
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [selectedAreas, hoverArea, selectedOption, fingerprints.length, theme]);

  return (
    <div className="relative flex justify-center items-center mx-auto">
      <Image alt="hands" height={300} id="hands" src="/hands1.png" width={500} />
      <canvas className="absolute pointer-events-none" id="canvas" />
    </div>
  );
}
