const replacePlaceholders = (template, replacements) => {
    return Object.entries(replacements)
        .reduce((result, [key, value]) => {
            const placeholder = `{${key}}`;
            return result.replace(new RegExp(placeholder, "g"), value);
        }, template);
};

module.exports = {
    replacePlaceholders
};
