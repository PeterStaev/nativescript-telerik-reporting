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
import { ReportingInstance } from "../instance";

type Value = any[] | string | Date | boolean | number;

export class ReportingClient {
    public readonly clientId: string;
    public readonly options: ReportingClientOptions;
    
    constructor(options: ReportingClientOptions);

    public getAvailableDocumentFormats(): Promise<DocumentFormat[]>;
    public register(): Promise<void>;
    public unregister(): Promise<void>;
    public getReportParameters(reportSource: ReportSource): Promise<ReportParameter[]>;
    public createInstance(reportSource: ReportSource): Promise<ReportingInstance>;
}

export interface ReportingClientOptions {
    serverUrl: string;
    additionalHeaders?: { [key: string]: string };
}

export interface DocumentFormat {
    name: string;
    localizedName: string;
}

export interface ReportSource {
    report: string;
    parameterValues?: { [id: string]: Value };
}

export interface ReportParameter {
    name: string;
    id: string;
    type: string;
    text: string;
    multivalue: boolean;
    allowNull: boolean;
    allowBlank: boolean;
    isVisible: boolean;
    autoRefresh: boolean;
    hasChildParameters: boolean;
    childParameters?: string[];
    availableValues?: ParameterValue[];
    value: Value;
    label: string;
}

export interface ParameterValue {
    name: string;
    value: Value;
}