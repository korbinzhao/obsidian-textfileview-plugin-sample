import { TFile, TextFileView, WorkspaceLeaf } from "obsidian";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { sendNotice } from './utils/notice';
import CustomViewContent from './components/CustomViewContent';

export const VIEW_TYPE_EXAMPLE = "example";

export const DEFAULT_DATA = '';

export class ExampleView extends TextFileView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    root: Root;

    data: string = DEFAULT_DATA;

    file: TFile;

    timer: NodeJS.Timeout | null;

    debounceSave = () => {
        this.timer && clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.timer && clearTimeout(this.timer);
            this.timer = null;
            this.save();
        }, 200);
    }

    getViewType() {
        return VIEW_TYPE_EXAMPLE;
    }

    async onLoadFile(file: TFile): Promise<void> {
        this.file = file;

        this.render(file);
    }

    async onUnloadFile(file: TFile): Promise<void> {
        this.clear();
    }

    onunload() {
        this.clear();

        this.root?.unmount();
    }

    async onClose() {
        this.root?.unmount();
    }

    getViewData(): string {
        return this.data;
    }

    setViewData(data: string = DEFAULT_DATA, clear: boolean = false): void {
        this.data = data;

        if (clear) {
            this.clear();
        }
    }

    async save(clear: boolean = false) {
        try {
            this.app.vault.modify(this.file, this.data);

            if (clear) {
                this.clear();
            }
        } catch (err) {
            console.error('Save failed:', err);
            sendNotice('Save failed!')
        }
    }

    onChange(value: string) {
        this.setViewData(value);
        this.debounceSave();
    }

    async render(file: TFile) {
        this.root = this.root || createRoot(this.containerEl.children[1]);;

        let fileData = await this.app.vault.read(file);

        this.setViewData(fileData);

        this.root?.render(
            <React.StrictMode>
                <CustomViewContent defaultValue={fileData} onChange={this.onChange.bind(this)} />
            </React.StrictMode>
        );
    }

    clear(): void {
        this.timer && clearTimeout(this.timer);
        this.timer = null;

        this.setViewData(DEFAULT_DATA);
        this.root?.render(null);
    }

}