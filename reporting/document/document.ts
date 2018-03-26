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
import { File, knownFolders } from "file-system";
import * as http from "http";
import { isJsonErrorIn, jsonHeaders } from "../../utils";
import { ReportingInstance } from "../instance";

import {
    DocumentFormat,
    DocumentInfo,
    PageInfo,
    ReportingDocument as ReportingDocumentBase,
} from ".";

export class ReportingDocument implements ReportingDocumentBase {
    private baseUrl: string;

    constructor(
        public instance: ReportingInstance,
        public documentId: string,
        public documentFormat: DocumentFormat,
    ) { 
        this.baseUrl = `${this.instance.client.options.serverUrl}/api/reports/clients/${this.instance.client.clientId}/instances/${this.instance.instanceId}/documents/${this.documentId}`;
    }
    
    public getInfo(): Promise<DocumentInfo> {
        return new Promise<DocumentInfo>((resolve, reject) => {
            http.request({
                method: "GET",
                url: `${this.baseUrl}/info`,
                headers: Object.assign({}, jsonHeaders, this.instance.client.options.additionalHeaders),
            }).then((response) => {
                const jsonResponse = response.content.toJSON();
                if (isJsonErrorIn(jsonResponse)) {
                    reject(jsonResponse);
                    return;
                }

                resolve(jsonResponse);
            }).catch(reject);
        });
    }

    public download(destination?: File): Promise<File> {
        return new Promise<File>((resolve, reject) => {
            this.ensureDocumentReady().then(
                () => {
                    const result = destination || knownFolders.temp().getFile(`${this.documentId}.${this.documentFormat.toLowerCase()}`);
                    http.getFile({
                        method: "GET",
                        url: this.baseUrl,
                        headers: this.instance.client.options.additionalHeaders,
                    }, result.path).then(resolve, reject);
                },
                reject,
            );
        });
    }

    public getPage(pageNumber: number): Promise<PageInfo> {
        return new Promise<PageInfo>((resolve, reject) => {
            http.request({
                method: "GET",
                url: `${this.baseUrl}/pages/${pageNumber}`,
                headers: Object.assign({}, jsonHeaders, this.instance.client.options.additionalHeaders),
            }).then((response) => {
                const jsonResponse = response.content.toJSON();
                if (isJsonErrorIn(jsonResponse)) {
                    reject(jsonResponse);
                    return;
                }

                resolve(jsonResponse);
            }).catch(reject);
        });
    }

    public destroy(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            http.request({
                method: "DELETE",
                url: this.baseUrl,
                headers: Object.assign({}, jsonHeaders, this.instance.client.options.additionalHeaders),
            }).then((response) => {
                if (response.content.toString() === "") {
                    resolve();
                    return;
                }
                
                reject(response.content.toJSON());
            }).catch(reject);
        });
    }

    private ensureDocumentReady(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getInfo().then(
                (result) => {
                    if (result.documentReady) {
                        resolve();
                        return;
                    }

                    const interval = setInterval(() => {
                        this.getInfo().then(
                            (intervalResult) => {
                                if (intervalResult.documentReady) {
                                    clearInterval(interval);
                                    resolve();
                                }
                            },
                            reject,
                        );
                    }, 1000);
                },
                reject,
            );
        });
    }
}
