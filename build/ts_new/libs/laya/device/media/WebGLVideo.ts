import { HtmlVideo } from "./HtmlVideo"
import { WebGLContext } from "../../webgl/WebGLContext";
import { ILaya } from "../../../ILaya";
import { LayaGPU } from "../../webgl/LayaGPU";
import { LayaGL } from "../../layagl/LayaGL";


/**
 * @internal
 */
export class WebGLVideo extends HtmlVideo {
	private gl: WebGLRenderingContext;

	private static curBindSource: any;

	constructor() {
		super();

		var gl: WebGLRenderingContext = LayaGL.instance;
		if (!ILaya.Render.isConchApp && ILaya.Browser.onIPhone)
			return;
		this.gl = ILaya.Render.isConchApp ? (window as any).LayaGLContext.instance : WebGLContext.mainContext;
		this._source = this.gl.createTexture();

		//preTarget = WebGLContext.curBindTexTarget; 
		//preTexture = WebGLContext.curBindTexValue;

		WebGLContext.bindTexture(this.gl, gl.TEXTURE_2D, this._source);

		this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		WebGLContext.bindTexture(this.gl, gl.TEXTURE_2D, null);

		//(preTarget && preTexture) && (WebGLContext.bindTexture(gl, preTarget, preTexture));
	}

	updateTexture(): void {
		if (!ILaya.Render.isConchApp && ILaya.Browser.onIPhone)
			return;
		var gl: WebGLRenderingContext = LayaGL.instance;
		WebGLContext.bindTexture(this.gl, gl.TEXTURE_2D, this._source);

		this.gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.video);

		WebGLVideo.curBindSource = this._source;
	}

	get _glTexture(): any {
		return this._source;
	}

		 /*override*/ destroy(): void {
		if (this._source) {
			this.gl = ILaya.Render.isConchApp ? (window as any).LayaGLContext.instance : WebGLContext.mainContext;

			if (WebGLVideo.curBindSource == this._source) {
				WebGLContext.bindTexture(this.gl, this.gl.TEXTURE_2D, null);
				WebGLVideo.curBindSource = null;
			}

			this.gl.deleteTexture(this._source);
		}

		super.destroy();
	}

}

