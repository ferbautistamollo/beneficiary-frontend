"use client";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useCallback, useEffect, useState } from "react";

import { ModalRegisterFileDossier } from "./manage";

import {
  deleteFileDossier,
  getAffiliateShowFileDossiers,
  getAllFileDossiers,
  getViewFileDossier,
} from "@/api/affiliate";
import {
  ButtonExpand,
  CardActions,
  EmptyContent,
  HeaderManage,
  SpinnerLoading,
  ViewerPdf,
} from "@/components/common";
import { usePerson } from "@/utils/context/PersonContext";
import { getAccessCookie } from "@/utils/helpers/cookie";
import { AffiliateFileDossier } from "@/utils/interfaces";

export const FileDossiers = () => {
  const [fileDossiers, setFileDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAllFileDossiers, setLoadingAllFileDossiers] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const { affiliateId } = usePerson();
  const [isEdit, setIsEdit] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [activeFileDossierId, setActiveFileDossierId] = useState<number | null>(null);
  const [sizePdf, setSizePdf] = useState<string>("w-[48%] border-l pl-2");
  const [sizeColumn, setSizeColumn] = useState<string>("w-[52%]");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataRegister, setDataRegister] = useState<any>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [fileDossierEdit, setFileDossierEdit] = useState<AffiliateFileDossier>();
  const [isCreateFileDossier, setIsCreateFileDossier] = useState(false);
  const [isUpdateFileDossier, setIsUpdateFileDossier] = useState(false);
  const [isDeleteFileDossier, setIsDeleteFileDossier] = useState(false);

  useEffect(() => {
    getFileDossiersAffiliate();
    getPermissions();
  }, []);

  const getPermissions = async () => {
    const { data } = await getAccessCookie();

    data.includes("isCreateFileDossier") ? setIsCreateFileDossier(true) : setIsCreateFileDossier(false);
    data.includes("isUpdateFileDossier") ? setIsUpdateFileDossier(true) : setIsUpdateFileDossier(false);
    data.includes("isDeleteFileDossier") ? setIsDeleteFileDossier(true) : setIsDeleteFileDossier(false);
  };

  const switchEdit = () => {
    setIsEdit(!isEdit);
  };

  const getFileDossiersAffiliate = useCallback(async () => {
    try {
      setLoading(true);
      setPdfBlob(null);
      setActiveFileDossierId(null);
      setIsEdit(false);
      const { error, message, data } = await getAffiliateShowFileDossiers(affiliateId);

      if (error) {
        addToast({
          title: `Ocurrió un problema, servidor: ${error}, servicio: ${data.serviceStatus}`,
          description: message,
          color: "warning",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        setFileDossiers([]);

        return;
      }

      if (Array.isArray(data)) {
        setFileDossiers([]);
      } else {
        setFileDossiers(data.fileDossiersAffiliate);
      }

      return;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  const removeFileDossier = async (fileDossierId: number) => {
    try {
      const { error, message } = await deleteFileDossier(affiliateId, String(fileDossierId));

      if (error) {
        addToast({
          title: "Ocurrido un error",
          description: message,
          color: "danger",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });

        return;
      }
      getFileDossiersAffiliate();
      addToast({
        title: "Expediente eliminado",
        description: message,
        color: "success",
        timeout: 3500,
        shouldShowTimeoutProgress: true,
      });

      return;
    } catch (error) {
      console.error("Error al eliminar expediente:", error);
    }
  };

  const viewTransition = async (fileDossierId: number) => {
    try {
      setLoadingDocument(true);
      setActiveFileDossierId(fileDossierId);
      const { error, message, data } = await getViewFileDossier(affiliateId, String(fileDossierId));

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      setPdfBlob(data);
    } catch (error) {
      console.error("Error al obtener el expediente:", error);
    } finally {
      setLoadingDocument(false);
    }
  };

  const handleResize = () => {
    if (sizePdf === "w-[100%]") {
      setSizePdf("w-[48%] border-l pl-2");
      setSizeColumn("w-[52%]");
    } else {
      setSizePdf("w-[100%]");
      setSizeColumn("w-[0%]");
    }
  };

  const renderContent = () => {
    if (loadingDocument) return <SpinnerLoading isLoading />;
    if (pdfBlob)
      return (
        <>
          <ButtonExpand onPress={handleResize} />
          <ViewerPdf blob={pdfBlob} />
        </>
      );

    return <EmptyContent text="SELECCIONA UN EXPEDIENTE PARA VISUALIZAR" />;
  };

  const editFileDossier = (fileDossier: AffiliateFileDossier) => {
    setFileDossierEdit(fileDossier);
    setIsUpdate(true);
    onOpen();
  };

  const handleOpenModal = async () => {
    try {
      setLoadingAllFileDossiers(true);
      const { error, message, data } = await getAllFileDossiers(affiliateId);

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });
        setDataRegister(null);

        return;
      }

      setDataRegister(data);
      onOpen();
    } catch (error) {
      console.error("Error al obtener los tipos de expedientes:", error);
    } finally {
      setLoadingAllFileDossiers(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col h-full w-full min-h-0">
        <SpinnerLoading isLoading={loading} />

        <HeaderManage
          isEdit={isEdit}
          isLoading={loadingAllFileDossiers}
          switchEdit={switchEdit}
          toEdit={isUpdateFileDossier || isDeleteFileDossier}
          toRegister={isCreateFileDossier}
          onPressRegister={handleOpenModal}
        />

        <div className="flex gap-1 flex-1 min-h-0">
          <div className={`flex flex-col gap-y-1 overflow-y-auto ${sizeColumn}`}>
            {fileDossiers.length > 0 ? (
              fileDossiers.map((fileDossier: AffiliateFileDossier, key) => (
                <CardActions
                  key={key}
                  activeId={String(activeFileDossierId)}
                  dataId={String(fileDossier.fileDossierId)}
                  isEdit={isEdit}
                  isLoading={loadingDocument}
                  sizeTextBody="text-xl"
                  textActive="VISUALIZANDO"
                  textBody={`${fileDossier.name}`}
                  textHeader={`${key + 1}. ${fileDossier.shortened}`}
                  textHover="VISUALIZAR"
                  textLoading="CARGANDO..."
                  onDelete={isDeleteFileDossier}
                  onEdit={isUpdateFileDossier}
                  onPress={() => viewTransition(fileDossier.fileDossierId)}
                  onPressDelete={() => removeFileDossier(fileDossier.fileDossierId)}
                  onPressEdit={() => editFileDossier(fileDossier)}
                />
              ))
            ) : (
              <EmptyContent text="NO EXISTEN EXPEDIENTES REGISTRADOS" />
            )}
          </div>

          <div className={`relative h-full ${sizePdf}`}>{renderContent()}</div>
        </div>
      </div>

      <ModalRegisterFileDossier
        affiliateFileDossier={fileDossierEdit}
        dataRegister={dataRegister}
        isOpen={isOpen}
        isUpdate={isUpdate}
        onClose={onClose}
        onRefreshFileDossiers={getFileDossiersAffiliate}
      />
    </>
  );
};
