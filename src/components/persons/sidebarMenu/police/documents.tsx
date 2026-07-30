"use client";
import type { AffiliateDocument } from "@/utils/interfaces";

import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useCallback, useEffect, useState } from "react";

import { ModalRegisterDocument } from "./manage";

import { deleteDocument, getAffiliateDocuments, getDocuments, getViewDocument } from "@/api/affiliate";
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

export const Documents = () => {
  const { affiliateId } = usePerson();

  const [documents, setDocuments] = useState<AffiliateDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAllDocument, setLoadingAllDocument] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<number | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [documentEdit, setDocumentEdit] = useState<AffiliateDocument>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataRegister, setDataRegister] = useState<any>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const sizePdf = isExpanded ? "w-[100%]" : "w-[48%] border-l pl-2";
  const sizeColumn = isExpanded ? "w-0" : "w-[52%]";

  const [isCreateDocument, setIsCreateDocument] = useState(false);
  const [isUpdateDocument, setIsUpdateDocument] = useState(false);
  const [isDeleteDocument, setIsDeleteDocument] = useState(false);

  useEffect(() => {
    getDocumentsAffiliate();
    getPermissions();
  }, []);

  const getPermissions = async () => {
    const { data } = await getAccessCookie();

    data.includes("isCreateDocument") ? setIsCreateDocument(true) : setIsCreateDocument(false);
    data.includes("isUpdateDocument") ? setIsUpdateDocument(true) : setIsUpdateDocument(false);
    data.includes("isDeleteDocument") ? setIsDeleteDocument(true) : setIsDeleteDocument(false);
  };

  const getDocumentsAffiliate = useCallback(async () => {
    try {
      setLoading(true);
      setPdfBlob(null);
      setActiveDocumentId(null);
      setIsEdit(false);
      const { data } = await getAffiliateDocuments(affiliateId);

      if (Array.isArray(data)) return setDocuments([]);

      setDocuments(data.documentsAffiliate ?? []);
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "No se pudieron cargar los documentos.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  const removeDocument = async (procedureDocumentId: number) => {
    try {
      const { error, message } = await deleteDocument(affiliateId, String(procedureDocumentId));

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
      getDocumentsAffiliate();
      addToast({
        title: "Documento eliminado",
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

  const viewTransition = async (documentId: number) => {
    try {
      setLoadingDocument(true);
      setActiveDocumentId(documentId);

      const { error, message, data } = await getViewDocument(affiliateId, String(documentId));

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
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

  const handleExpand = () => setIsExpanded((prev) => !prev);

  const editDocument = (document: AffiliateDocument) => {
    setDocumentEdit(document);
    setIsUpdate(true);
    onOpen();
  };

  const renderContent = () => {
    if (loadingDocument) return <SpinnerLoading isLoading />;
    if (pdfBlob)
      return (
        <>
          <ButtonExpand onPress={handleExpand} />
          <ViewerPdf blob={pdfBlob} />
        </>
      );

    return <EmptyContent text="SELECCIONA UN DOCUMENTO PARA VISUALIZAR" />;
  };

  const handleOpenModal = async () => {
    try {
      setDocumentEdit(undefined);
      setIsUpdate(false);
      setLoadingAllDocument(true);
      const { error, message, data } = await getDocuments(affiliateId);

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
      setLoadingAllDocument(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col h-full w-full min-h-0">
        <SpinnerLoading isLoading={loading} />

        <HeaderManage
          isEdit={isEdit}
          isLoading={loadingAllDocument}
          switchEdit={() => setIsEdit((prev) => !prev)}
          toEdit={isUpdateDocument || isDeleteDocument}
          toRegister={isCreateDocument}
          onPressRegister={handleOpenModal}
        />

        <div className="flex gap-1 flex-1 min-h-0">
          <div className={`flex flex-col gap-y-1 overflow-y-auto ${sizeColumn}`}>
            {documents.length > 0 ? (
              documents.map((doc, key) => (
                <CardActions
                  key={key}
                  activeId={String(activeDocumentId)}
                  dataId={String(doc.procedureDocumentId)}
                  height="min-h-[120px]"
                  isEdit={isEdit}
                  isLoading={loadingDocument}
                  sizeTextBody="text-sm"
                  textActive="VISUALIZANDO"
                  textBody={`${doc.name}`}
                  textHeader={`${key + 1}. ${doc.shortened}`}
                  textHover="VISUALIZAR"
                  textLoading="CARGANDO..."
                  onDelete={isDeleteDocument}
                  onEdit={isUpdateDocument}
                  onPress={() => viewTransition(doc.procedureDocumentId)}
                  onPressDelete={() => removeDocument(doc.procedureDocumentId)}
                  onPressEdit={() => editDocument(doc)}
                />
              ))
            ) : (
              <EmptyContent text="NO EXISTEN DOCUMENTOS REGISTRADOS" />
            )}
          </div>
          <div className={`relative h-full ${sizePdf}`}>{renderContent()}</div>
        </div>
      </div>

      <ModalRegisterDocument
        affiliateDocument={documentEdit}
        dataRegister={dataRegister}
        isOpen={isOpen}
        isUpdate={isUpdate}
        onClose={onClose}
        onRefreshDocuments={getDocumentsAffiliate}
      />
    </>
  );
};
