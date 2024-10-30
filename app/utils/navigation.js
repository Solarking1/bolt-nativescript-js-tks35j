export function navigate(page, context = {}) {
    const frame = require("@nativescript/core").Frame;
    frame.topmost().navigate({
        moduleName: `components/${page}/${page}-page`,
        context: context
    });
}