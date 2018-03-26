/*! *****************************************************************************
Copyright (c) 2018 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */
import { File } from "file-system";
import { ReportingInstance } from "../instance";

export class ReportingDocument {
    public instance: ReportingInstance;
    public documentId: string;
    public documentFormat: DocumentFormat;
    
    constructor(instance: ReportingInstance, documentId: string, documentFormat: DocumentFormat);
    
    public getInfo(): Promise<DocumentInfo>;
    public download(destination?: File): Promise<File>;
    public getPage(pageNumber: number): Promise<PageInfo>;
    public destroy(): Promise<void>;
}

export const enum DocumentFormat {
    Pdf = "PDF",
    Xls = "XLS",
    Csv = "CSV",
    Rtf = "RTF",
    Xps = "XPS",
    Docx = "DOCX",
    Xlsx = "XLSX",
    Pptx = "PPTX",
    Mhtml = "MHTML",
    Image = "IMAGE",
    Html5 = "HTML5",
    Html5Interactive = "HTML5Interactive",
}

export interface DocumentFormatKey {
    format: DocumentFormat;
    deviceInfo?: { [key: string]: any };
}

export interface DocumentInfo {
    documentReady: boolean;
    pageCount: number;
    documentMapAvailable?: boolean;
    bookmarkNodes?: BookmarkNode[];
}

export interface BookmarkNode {
    id: string;
    text?: string;
    page: number;
    items?: string[]
}

export interface PageInfo {
    pageReady: boolean;
    pageNumber: number;
    pageContent?: string | number[]
}