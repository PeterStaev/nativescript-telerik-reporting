
import * as application from "application";
import { EventData, fromObject } from "data/observable";
import * as fs from "file-system";
import { FileSystemAccess } from "file-system/file-system-access";
import { isAndroid, isIOS } from "platform";
import { Page } from "ui/page";
import * as utils from "utils/utils";

import * as permissions from "nativescript-permissions";
import { DocumentFormat, ReportSource, ReportingClient } from "nativescript-telerik-reporting";

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
                const path =
                    isIOS
                        ? fs.knownFolders.temp().path
                        : fs.path.join(android.os.Environment.getExternalStorageDirectory().toString(), application.android.foregroundActivity.getPackageName());
                        
                let permissionPromise = new Promise((resolve, reject) => resolve());
                if (isAndroid) {
                    permissionPromise = permissions.requestPermission((android as any).Manifest.permission.WRITE_EXTERNAL_STORAGE);
                }

                permissionPromise
                    .then(() => {
                        const tempFile = fs.File.fromPath(fs.path.join(path, `${document.documentId}.${document.documentFormat.toLowerCase()}`))
                        return document.download(tempFile);
                    })
                    .then((file) => {
                        openFile(file.path);
                        viewModel.set("isBusyIn", false);

                        document.destroy()
                            .then(() => instance.destroy())
                            .then(() => reportingClient.unregister, console.error);
                    }, console.error);
            }, console.error);
        }, console.error);
}

function openFile(path: string) {
    if (isIOS) {
        utils.ios.openFile(path);
        return;
    }

    const fsa = new FileSystemAccess();
    const mimeTypeMap = android.webkit.MimeTypeMap.getSingleton();
    const mimeType = mimeTypeMap.getMimeTypeFromExtension(fsa.getFileExtension(path).replace(".", "").toLowerCase());
    const intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
    intent.setDataAndType(android.net.Uri.fromFile(new java.io.File(path)), mimeType);

    application.android.currentContext.startActivity(android.content.Intent.createChooser(intent, "Open File..."));
}