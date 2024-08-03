// @ts-check

import stylistic from "@stylistic/eslint-plugin"
// @ts-expect-error - can't find type declarations for "@typescript-eslint/parser"
import parserTs from "@typescript-eslint/parser"

const includes = ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
const ignores = ["dist/**/*", "docs/**/*", ".tsbuild/**/*"]

const indent = 4

const styleRules = {
    "@stylistic/array-bracket-newline": ["error", "consistent"],
    "@stylistic/array-bracket-spacing": ["error", "never"],
    "@stylistic/array-element-newline": ["error", "consistent"],
    "@stylistic/arrow-parens": ["error", "always"],
    "@stylistic/arrow-spacing": ["error", {before: true, after: true}],
    "@stylistic/block-spacing": ["error", "always"],
    "@stylistic/brace-style": ["error", "1tbs"],
    "@stylistic/comma-dangle": ["error", "always-multiline"],
    "@stylistic/comma-spacing": ["error", {before: false, after: true}],
    "@stylistic/comma-style": ["error", "last"],
    "@stylistic/computed-property-spacing": ["error", "never"],
    "@stylistic/dot-location": ["error", "property"],
    "@stylistic/eol-last": ["error", "always"],
    "@stylistic/function-call-argument-newline": ["error", "consistent"],
    "@stylistic/function-call-spacing": ["error", "never"],
    "@stylistic/function-paren-newline": ["error", "multiline"],
    "@stylistic/generator-star-spacing": ["error", "before"],
    "@stylistic/implicit-arrow-linebreak": "off",
    "@stylistic/indent": ["error", indent],
    "@stylistic/indent-binary-ops": ["error", indent],
    "@stylistic/jsx-child-element-spacing": "off",
    "@stylistic/jsx-closing-bracket-location": ["error", "tag-aligned"],
    "@stylistic/jsx-closing-tag-location": "error",
    "@stylistic/jsx-curly-brace-presence": ["error", {propElementValues: "always"}],
    "@stylistic/jsx-curly-newline": ["error", {multiline: "consistent", singleline: "consistent"}],
    "@stylistic/jsx-curly-spacing": ["error", {when: "never"}],
    "@stylistic/jsx-equals-spacing": ["error", "never"],
    "@stylistic/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
    "@stylistic/jsx-max-props-per-line": "off",
    "@stylistic/jsx-newline": "off",
    "@stylistic/jsx-one-expression-per-line": "off",
    "@stylistic/jsx-pascal-case": "off",
    "@stylistic/jsx-quotes": ["error", "prefer-double"],
    "@stylistic/jsx-self-closing-comp": "off",
    "@stylistic/jsx-sort-props": "off",
    "@stylistic/jsx-tag-spacing": "error",
    "@stylistic/jsx-wrap-multilines": ["error", {declaration: "parens-new-line", assignment: "parens-new-line", return: "parens-new-line", arrow: "parens-new-line"}],
    "@stylistic/key-spacing": "error",
    "@stylistic/keyword-spacing": "error",
    "@stylistic/line-comment-position": "off",
    "@stylistic/linebreak-style": ["error", "unix"],
    "@stylistic/lines-around-comment": "off",
    "@stylistic/lines-between-class-members": "off",
    "@stylistic/max-len": "off",
    "@stylistic/max-statements-per-line": "error",
    "@stylistic/member-delimiter-style": "error",
    "@stylistic/multiline-comment-style": "off",
    "@stylistic/multiline-ternary": "off",
    "@stylistic/new-parens": ["error", "always"],
    "@stylistic/newline-per-chained-call": "off",
    "@stylistic/no-confusing-arrow": "off",
    "@stylistic/no-extra-parens": "off",
    "@stylistic/no-extra-semi": "error",
    "@stylistic/no-floating-decimal": "off",
    "@stylistic/no-mixed-operators": "off",
    "@stylistic/no-mixed-spaces-and-tabs": "off",
    "@stylistic/no-multi-spaces": "error",
    "@stylistic/no-multiple-empty-lines": ["error", {max: 1}],
    "@stylistic/no-tabs": "error",
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/no-whitespace-before-property": "error",
    "@stylistic/nonblock-statement-body-position": ["error", "beside"],
    "@stylistic/object-curly-newline": ["error", {consistent: true}],
    "@stylistic/object-curly-spacing": ["error", "never"],
    "@stylistic/object-property-newline": ["error", {allowAllPropertiesOnSameLine: true}],
    "@stylistic/one-var-declaration": "off",
    "@stylistic/operator-linebreak": "off",
    "@stylistic/padded-blocks": "off",
    "@stylistic/padding-line-between-statements": "off",
    "@stylistic/quote-props": ["error", "consistent"],
    "@stylistic/quotes": ["error", "double", {avoidEscape: true, allowTemplateLiterals: true}],
    "@stylistic/rest-spread-spacing": "error",
    "@stylistic/semi": ["error", "never"],
    "@stylistic/semi-spacing": ["error", {before: false, after: false}],
    "@stylistic/semi-style": ["error", "first"],
    "@stylistic/space-before-blocks": "error",
    "@stylistic/space-before-function-paren": ["error", {anonymous: "always", named: "never", asyncArrow: "always"}],
    "@stylistic/space-in-parens": ["error", "never"],
    "@stylistic/space-infix-ops": "error",
    "@stylistic/space-unary-ops": ["error", {words: false, nonwords: true}],
    "@stylistic/spaced-comment": ["error", "always", {markers: ["/"]}],
    "@stylistic/switch-colon-spacing": "error",
    "@stylistic/template-curly-spacing": ["error", "never"],
    "@stylistic/template-tag-spacing": ["error", "never"],
    "@stylistic/type-annotation-spacing": "error",
    "@stylistic/type-generic-spacing": "error",
    "@stylistic/type-named-tuple-spacing": "error",
    "@stylistic/wrap-iife": ["error", "inside"],
    "@stylistic/wrap-regex": "off",
    "@stylistic/yield-star-spacing": "error",
}

export default [
    {
        rules: styleRules,
        ignores,
        files: includes,
        languageOptions: {parser: parserTs},
        plugins: {
            "@stylistic": stylistic,
        },
    },
]
