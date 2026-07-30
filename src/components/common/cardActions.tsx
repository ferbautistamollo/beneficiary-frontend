"use client";

import { Card, CardBody } from "@heroui/card";
import { useState } from "react";

import { ModalAlert } from "./modalAlert";

import { ButtonEdit, ButtonDelete } from "@/components/common";

interface Props {
  textHeader?: string;
  textBody?: string;
  textActive?: string;
  textLoading?: string;
  textHover?: string;
  isEdit?: boolean;
  activeId?: string;
  dataId?: string;
  isLoading?: boolean;
  onPress?: () => void;
  onDelete?: boolean;
  onPressDelete?: (data: any) => void;
  onEdit?: boolean;
  onPressEdit?: () => void;
  height?: string;
  sizeTextBody?: "text-sm" | "text-md" | "text-lg" | "text-xl";
}

export const CardActions = ({
  textHeader,
  textBody,
  textActive,
  textLoading,
  textHover,
  isEdit = false,
  activeId = "0",
  dataId,
  isLoading = false,
  onPress = () => {},
  onDelete = false,
  onPressDelete = () => {},
  onEdit = false,
  onPressEdit = () => {},
  height = "min-h-[auto]",
  sizeTextBody = "text-sm",
}: Props) => {
  const [openModalAlert, setOpenModalAlert] = useState(false);

  return (
    <>
      <Card
        className={`group border-small rounded-small border-default-200 dark:border-default-200 ${height} w-auto max-w-full`}
        isPressable={!isEdit && activeId !== dataId}
        onPress={onPress}
      >
        <CardBody className="flex flex-col gap-2 relative">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <span className="text-sm font-bold wrap-break-word">{textHeader}</span>

            <div className="flex items-center gap-1 shrink-0 min-h-8">
              <span
                className={`text-xs font-semibold transition-opacity duration-200 whitespace-nowrap
                  ${
                    activeId === dataId
                      ? isLoading
                        ? "text-blue-600 opacity-100"
                        : "text-green-600 opacity-100"
                      : "text-yellow-600 opacity-0 group-hover:opacity-100"
                  }
                `}
              >
                {activeId === dataId ? (isLoading ? textLoading : textActive) : !isEdit ? textHover : ""}
              </span>

              {onEdit && isEdit && <ButtonEdit onPress={onPressEdit} />}
              {onDelete && isEdit && <ButtonDelete onPress={() => setOpenModalAlert(true)} />}
            </div>
          </div>
          <div>
            <p className={`${sizeTextBody} wrap-break-word`}>{textBody}</p>
          </div>
        </CardBody>
      </Card>

      <ModalAlert
        cancelText="Cancelar"
        confirmText="Sí, eliminar"
        isOpen={openModalAlert}
        message={`¿Está seguro que desea eliminar ${textHeader}?`}
        title={`Eliminar ${textHeader}`}
        onClose={() => setOpenModalAlert(false)}
        onConfirm={() => {
          onPressDelete(dataId);
          setOpenModalAlert(false);
        }}
      />
    </>
  );
};
