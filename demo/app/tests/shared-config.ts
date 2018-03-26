import { ReportSource } from "nativescript-telerik-reporting";

export const serverUrl = "https://demos.telerik.com/reporting/";
export const reportSource: ReportSource = {
    report: "Telerik.Reporting.Examples.CSharp.Invoice, CSharp.ReportLibrary, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
    parameterValues: {
        OrderNumber: "SO51081",
        ForYear: 2003,
        ForMonth: 7,
    },
};