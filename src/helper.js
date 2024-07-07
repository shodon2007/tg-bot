function textReplacer(text, replaces) {
    let replacedText = text;
    replaces.forEach(([match, replace]) => {
        replacedText = replacedText.replace(`%${match}%`, replace);
    })
    // const startIndex = text.indexOf(`%${match}%`);
    // const endIndex = text.indexOf("%", startIndex + 1);
    // const newText = text.slice(0, startIndex) + replace + text.slice(endIndex + 1);


    return replacedText;
    // return text.replace(match, replace);
}

module.exports = textReplacer;