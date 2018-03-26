
import { EventData, fromObject } from "data/observable";
import { DocumentFormat, ReportSource, ReportingClient } from "nativescript-telerik-reporting";
import { Page } from "ui/page";
import * as utils from "utils/utils";

const serverUrl = "https://demos.telerik.com/reporting/";

const viewModel = fromObject({
    selectedIndex: 0,
    isBusyIn: false,
    items: [],
});
let formats: DocumentFormat[];

export function navigatingTo(args: EventData) {
    (args.object as Page).bindingContext = viewModel;
    const reportingClient = new ReportingClient({ serverUrl });
    viewModel.set("isBusyIn", true);
    reportingClient.getAvailableDocumentFormats().then((result) => {
        formats = result;
        const items = result.map((value) => value.localizedName);
        viewModel.set("items", items);
        viewModel.set("isBusyIn", false);
    }, console.error);
}

export function openDocument() {
    const req: ReportSource = {
        report: "Telerik.Reporting.Examples.CSharp.Invoice, CSharp.ReportLibrary, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
        parameterValues: {
            OrderNumber: "SO51081",
            ForYear: 2003,
            ForMonth: 7,
        },
    };
    const documentFormat = formats[viewModel.get("selectedIndex")].name;

    viewModel.set("isBusyIn", true);

    const reportingClient = new ReportingClient({ serverUrl });
    reportingClient.register()
        .then(() => reportingClient.createInstance(req))
        .then((instance) => {
            instance.createDocument({ format: documentFormat } as any).then((document) => {
                document.download().then((file) => {
                    utils.ios.openFile(file.path);
                    viewModel.set("isBusyIn", false);

                    document.destroy()
                        .then(() => instance.destroy())
                        .then(() => reportingClient.unregister, console.error);
                }, console.error);
            }, console.error);
        }, console.error);
}