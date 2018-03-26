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
import { ReportingInstance } from "../instance";

import {
    DocumentFormat,
    ReportParameter,
    ReportSource,
    ReportingClient as ReportingClientBase,
    ReportingClientOptions,
} from ".";

export class ReportingClient implements ReportingClientBase {
    public clientId: string;

    constructor(public options: ReportingClientOptions) { 
        this.options.additionalHeaders = this.options.additionalHeaders || {};
    }

    public getAvailableDocumentFormats(): Promise<DocumentFormat[]> {
        return new Promise<DocumentFormat[]>((resolve, reject) => {
            http.request({
                method: "GET",
                url: `${this.options.serverUrl}/api/reports/formats`,
                headers: Object.assign({}, jsonHeaders, this.options.additionalHeaders),
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

    public register(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            http.request({
                method: "POST",
                url: `${this.options.serverUrl}/api/reports/clients`,
                headers: Object.assign({}, jsonHeaders, this.options.additionalHeaders),
            }).then((response) => {
                const jsonResponse = response.content.toJSON();
                if (isJsonErrorIn(jsonResponse)) {
                    reject(jsonResponse);
                    return;
                }
                this.clientId = jsonResponse.clientId;
                
                resolve();
            }).catch(reject);
        });
    }

    public unregister(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            http.request({
                method: "DELETE",
                url: `${this.options.serverUrl}/api/reports/clients/${this.clientId}`,
                headers: Object.assign({}, jsonHeaders, this.options.additionalHeaders),
            }).then((response) => {
                if (response.content.toString() === "") {
                    resolve();
                    return;
                }
                
                reject(response.content.toJSON());
            }).catch(reject);
        });
    }

    public getReportParameters(reportSource: ReportSource): Promise<ReportParameter[]>{
        return new Promise<ReportParameter[]>((resolve, reject) => {
            http.request({
                method: "POST",
                url: `${this.options.serverUrl}/api/reports/clients/${this.clientId}/parameters`,
                headers: Object.assign({}, jsonHeaders, this.options.additionalHeaders),
                content: JSON.stringify(reportSource),
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

    public createInstance(reportSource: ReportSource): Promise<ReportingInstance> {
        return new Promise<ReportingInstance>((resolve, reject) => {
            http.request({
                method: "POST",
                url: `${this.options.serverUrl}/api/reports/clients/${this.clientId}/instances`,
                headers: Object.assign({}, jsonHeaders, this.options.additionalHeaders),
                content: JSON.stringify(reportSource),
            }).then((response) => {
                const jsonResponse = response.content.toJSON();
                if (isJsonErrorIn(jsonResponse)) {
                    reject(jsonResponse);
                    return;
                }

                resolve(new ReportingInstance(this, jsonResponse.instanceId));
            }).catch(reject);
        });
    }
}