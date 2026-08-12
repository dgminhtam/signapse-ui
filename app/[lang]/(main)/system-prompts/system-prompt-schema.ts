import type { JsonValue } from "@/app/lib/system-prompts/definitions"

export const SYSTEM_PROMPT_SCHEMA_TYPES = [
  "object",
  "array",
  "string",
  "number",
  "boolean",
] as const

export type SystemPromptSchemaType = (typeof SYSTEM_PROMPT_SCHEMA_TYPES)[number]
export type JsonObject = { [key: string]: JsonValue }

const NULL_SCHEMA_TYPE = "null"
const OBJECT_KEYS = new Set([
  "type",
  "properties",
  "required",
  "additionalProperties",
  "nullable",
])
const ARRAY_KEYS = new Set(["type", "items", "nullable"])
const STRING_KEYS = new Set(["type", "enum", "minLength", "nullable"])
const NUMBER_KEYS = new Set(["type", "minimum", "maximum", "nullable"])
const BOOLEAN_KEYS = new Set(["type", "nullable"])

export function createMinimalResponseSchema(): JsonObject {
  return {
    type: "object",
    additionalProperties: false,
    properties: {},
  }
}

export function createSchemaForType(
  type: SystemPromptSchemaType,
  options: { nullable?: boolean } = {}
): JsonObject {
  const schema: JsonObject =
    type === "object"
      ? createMinimalResponseSchema()
      : type === "array"
        ? {
            type: "array",
            items: { type: "string" },
          }
        : { type }

  if (options.nullable) {
    schema.nullable = true
  }

  return schema
}

export function cloneJsonValue<T extends JsonValue | undefined>(value: T): T {
  if (value === undefined) {
    return value
  }

  return JSON.parse(JSON.stringify(value)) as T
}

export function formatJsonValue(value: JsonValue | undefined) {
  return JSON.stringify(value ?? createMinimalResponseSchema(), null, 2)
}

export function parseJsonValue(
  text: string
): { success: true; value: JsonValue } | { success: false; error: string } {
  try {
    return { success: true, value: JSON.parse(text) as JsonValue }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    }
  }
}

export function isJsonObject(
  value: JsonValue | undefined
): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function getSchemaType(
  schema: JsonValue | undefined
): SystemPromptSchemaType | null {
  if (!isJsonObject(schema)) {
    return null
  }

  const type = schema.type

  if (typeof type === "string") {
    return isSystemPromptSchemaType(type) ? type : null
  }

  if (!Array.isArray(type)) {
    return null
  }

  const stringTypes = type.filter(
    (item): item is string => typeof item === "string"
  )
  const uniqueTypes = [...new Set(stringTypes)]
  const nonNullTypes = uniqueTypes.filter((item) => item !== NULL_SCHEMA_TYPE)

  if (
    stringTypes.length !== type.length ||
    uniqueTypes.length !== type.length ||
    !uniqueTypes.includes(NULL_SCHEMA_TYPE) ||
    nonNullTypes.length !== 1
  ) {
    return null
  }

  const [baseType] = nonNullTypes

  return isSystemPromptSchemaType(baseType) ? baseType : null
}

export function getSchemaNullable(schema: JsonObject): boolean {
  if (schema.nullable === true) {
    return true
  }

  const type = schema.type

  return Array.isArray(type) && type.includes(NULL_SCHEMA_TYPE)
}

export function getSchemaProperties(
  schema: JsonObject
): Record<string, JsonValue> {
  const properties = schema.properties

  if (!isJsonObject(properties)) {
    return {}
  }

  return properties
}

export function getSchemaRequired(schema: JsonObject): string[] {
  const required = schema.required

  if (!Array.isArray(required)) {
    return []
  }

  return required.filter((item): item is string => typeof item === "string")
}

export function getStringEnumValues(schema: JsonObject): string {
  const enumValues = schema.enum

  if (!Array.isArray(enumValues)) {
    return ""
  }

  return enumValues
    .filter((item): item is string => typeof item === "string")
    .join(", ")
}

export function getStringMinLengthValue(schema: JsonObject): string {
  return typeof schema.minLength === "number" ? String(schema.minLength) : ""
}

export function hasEditedLocalizedNames(names: Record<string, string>) {
  return Object.values(names).some((value) => value.trim().length > 0)
}

export function compactLocalizedNames(names: Record<string, string>) {
  const entries = Object.entries(names)
    .map(([locale, value]) => [locale, value.trim()] as const)
    .filter(([, value]) => value.length > 0)

  return Object.fromEntries(entries)
}

export function jsonValuesEqual(
  first: JsonValue | Record<string, string> | undefined,
  second: JsonValue | Record<string, string> | undefined
) {
  return JSON.stringify(first ?? null) === JSON.stringify(second ?? null)
}

export function isSupportedBuilderSchema(
  schema: JsonValue | undefined
): boolean {
  if (!isJsonObject(schema)) {
    return false
  }

  const type = getSchemaType(schema)

  if (type === "object") {
    return hasOnlyKeys(schema, OBJECT_KEYS) && isSupportedObjectSchema(schema)
  }

  if (type === "array") {
    return hasOnlyKeys(schema, ARRAY_KEYS) && isSupportedArraySchema(schema)
  }

  if (type === "string") {
    return hasOnlyKeys(schema, STRING_KEYS) && isSupportedStringSchema(schema)
  }

  if (type === "number") {
    return hasOnlyKeys(schema, NUMBER_KEYS) && isSupportedNumberSchema(schema)
  }

  if (type === "boolean") {
    return hasOnlyKeys(schema, BOOLEAN_KEYS) && hasSupportedNullable(schema)
  }

  return false
}

function hasOnlyKeys(schema: JsonObject, keys: Set<string>) {
  return Object.keys(schema).every((key) => keys.has(key))
}

function isSystemPromptSchemaType(
  value: string
): value is SystemPromptSchemaType {
  return SYSTEM_PROMPT_SCHEMA_TYPES.includes(value as SystemPromptSchemaType)
}

function hasSupportedNullable(schema: JsonObject) {
  return schema.nullable === undefined || typeof schema.nullable === "boolean"
}

function isSupportedObjectSchema(schema: JsonObject) {
  const properties = schema.properties
  const required = schema.required
  const additionalProperties = schema.additionalProperties

  if (!hasSupportedNullable(schema)) {
    return false
  }

  if (properties !== undefined) {
    if (!isJsonObject(properties)) {
      return false
    }

    const propertiesSupported = Object.values(properties).every((property) =>
      isSupportedBuilderSchema(property)
    )

    if (!propertiesSupported) {
      return false
    }
  }

  if (
    required !== undefined &&
    (!Array.isArray(required) ||
      required.some((item) => typeof item !== "string"))
  ) {
    return false
  }

  return (
    additionalProperties === undefined ||
    typeof additionalProperties === "boolean" ||
    isSupportedBuilderSchema(additionalProperties)
  )
}

function isSupportedArraySchema(schema: JsonObject) {
  return (
    hasSupportedNullable(schema) &&
    (schema.items === undefined || isSupportedBuilderSchema(schema.items))
  )
}

function isSupportedStringSchema(schema: JsonObject) {
  return (
    hasSupportedNullable(schema) &&
    (schema.minLength === undefined || typeof schema.minLength === "number") &&
    (schema.enum === undefined ||
      (Array.isArray(schema.enum) &&
        schema.enum.every((item) => typeof item === "string")))
  )
}

function isSupportedNumberSchema(schema: JsonObject) {
  return (
    hasSupportedNullable(schema) &&
    (schema.minimum === undefined || typeof schema.minimum === "number") &&
    (schema.maximum === undefined || typeof schema.maximum === "number")
  )
}
