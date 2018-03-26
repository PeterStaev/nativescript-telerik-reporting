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
import * as http from "http";
import { isJsonErrorIn, jsonHeaders } from "../../utils";
import { ReportingClient } from "../client";
import { DocumentFormatKey, ReportingDocument } from "../document";

import { ReportingInstance as ReportingInstanceBase } from ".";

export class ReportingInstance implements ReportingInstanceBase {
    private baseUrl: string;

    constructor(public client: ReportingClient, public instanceId: string) { 
        this.baseUrl = `${this.client.options.serverUrl}/api/reports/clients/${this.client.clientId}/instances/${this.instanceId}`;
    }
    
    public createDocument(formatKey: DocumentFormatKey): Promise<ReportingDocument> {
        return new Promise<ReportingDocument>((resolve, reject) => {
            http.request({
                method: "POST",
                url: `${this.baseUrl}/documents`,
                headers: Object.assign({}, jsonHeaders, this.client.options.additionalHeaders),
                content: JSON.stringify(formatKey),
            }).then((response) => {
                const jsonResponse = response.content.toJSON();
                if (isJsonErrorIn(jsonResponse)) {
                    reject(jsonResponse);
                    return;
                }

                resolve(new ReportingDocument(this, jsonResponse.documentId, formatKey.format));
            }).catch(reject);
        });
    }

    public destroy(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            http.request({
                method: "DELETE",
                url: this.baseUrl,
                headers: Object.assign({}, jsonHeaders, this.client.options.additionalHeaders),
            }).then((response) => {
                if (response.content.toString() === "") {
                    resolve();
                    return;
                }
                
                reject(response.content.toJSON());
            }).catch(reject);
        });
    }
}