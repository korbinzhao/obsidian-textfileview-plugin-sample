import { Plugin } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from './view';
import { ICON_NAME, FILE_EXTENSION } from './constants';
import { sendNotice } from './utils/notice';
import { DEFAULT_DATA } from './view';

export default class ExamplePlugin extends Plugin {

	async onload() {
		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new ExampleView(leaf)
		);

		this.registerExtensions([FILE_EXTENSION], VIEW_TYPE_EXAMPLE);

		this.addRibbonIcon(ICON_NAME, "Create New Example File", async (e) => {

			this.createAndOpenDrawing();
		});

		sendNotice('Example Plugin Load!');

	}


	public async createAndOpenDrawing(): Promise<string> {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);

		const file = await this.app.vault.create(`Example ${window.moment().format('YY-MM-DD hh.mm.ss')}.${FILE_EXTENSION}`, DEFAULT_DATA);

		const leaf = this.app.workspace.getLeaf('tab');

		await leaf.openFile(file, { active: true });

		leaf.setViewState({
			type: VIEW_TYPE_EXAMPLE,
			state: leaf.view.getState(),
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0]
		);

		return file.path;

	}

}

