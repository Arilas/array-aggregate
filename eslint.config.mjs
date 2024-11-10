import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts'],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
    }
  }
)
