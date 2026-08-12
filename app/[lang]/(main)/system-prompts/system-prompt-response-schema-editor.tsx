"use client"

import { ChevronDown, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import type { JsonValue } from "@/app/lib/system-prompts/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  createSchemaForType,
  formatJsonValue,
  getSchemaNullable,
  getSchemaProperties,
  getSchemaRequired,
  getSchemaType,
  getStringEnumValues,
  getStringMinLengthValue,
  isJsonObject,
  isSupportedBuilderSchema,
  parseJsonValue,
  SYSTEM_PROMPT_SCHEMA_TYPES,
  SystemPromptSchemaType,
  type JsonObject,
} from "./system-prompt-schema"

interface SystemPromptResponseSchemaEditorProps {
  value: JsonValue | undefined
  error?: string
  onChange: (value: JsonValue) => void
  onErrorChange: (error?: string) => void
}

interface SchemaNodeEditorProps {
  schema: JsonValue
  onChange: (schema: JsonValue) => void
  depth?: number
}

export function SystemPromptResponseSchemaEditor({
  value,
  error,
  onChange,
  onErrorChange,
}: SystemPromptResponseSchemaEditorProps) {
  const { dictionary, formatMessage } = useLocalization()
  const t = dictionary.systemPrompts
  const [jsonText, setJsonText] = useState(() => formatJsonValue(value))
  const [jsonDirty, setJsonDirty] = useState(false)
  const currentJsonText = jsonDirty ? jsonText : formatJsonValue(value)
  const canUseBuilder = isSupportedBuilderSchema(value)
  const jsonError = error?.startsWith("json:") ? error.slice(5) : undefined

  function handleApplyJson() {
    const result = parseJsonValue(currentJsonText)

    if (!result.success) {
      onErrorChange(
        `json:${formatMessage(t.schemaJsonInvalid, { error: result.error })}`
      )
      return
    }

    if (!isJsonObject(result.value)) {
      onErrorChange(t.schemaRequiredError)
      return
    }

    onErrorChange(undefined)
    setJsonDirty(false)
    setJsonText(formatJsonValue(result.value))
    onChange(result.value)
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel>{t.responseSchema}</FieldLabel>
      <Tabs defaultValue="builder">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FieldDescription>{t.responseSchemaDescription}</FieldDescription>
          <TabsList>
            <TabsTrigger value="builder">{t.schemaBuilderTab}</TabsTrigger>
            <TabsTrigger value="json">{t.schemaJsonTab}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="builder">
          {canUseBuilder && value ? (
            <SchemaNodeEditor
              schema={value}
              onChange={(schema) => {
                setJsonDirty(false)
                onErrorChange(undefined)
                onChange(schema)
              }}
            />
          ) : (
            <div className="flex flex-col gap-2 rounded-lg border border-dashed p-4">
              <p className="text-sm font-medium">{t.schemaUnsupportedTitle}</p>
              <p className="text-sm text-muted-foreground">
                {t.schemaUnsupportedDescription}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="json">
          <InputGroup>
            <InputGroupTextarea
              value={currentJsonText}
              onChange={(event) => {
                const nextText = event.target.value
                setJsonDirty(true)
                setJsonText(nextText)
                const result = parseJsonValue(nextText)

                if (result.success && isJsonObject(result.value)) {
                  onErrorChange(undefined)
                  onChange(result.value)
                } else if (result.success) {
                  onErrorChange(t.schemaRequiredError)
                } else {
                  onErrorChange(
                    `json:${formatMessage(t.schemaJsonInvalid, {
                      error: result.error,
                    })}`
                  )
                }
              }}
              rows={16}
              aria-invalid={Boolean(jsonError)}
              className="min-h-[360px] resize-y font-mono text-sm leading-6"
              placeholder={t.schemaJsonPlaceholder}
            />
            <InputGroupAddon align="block-end">
              <div className="flex w-full items-center justify-between gap-2">
                <InputGroupText>{t.responseSchema}</InputGroupText>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyJson}
                >
                  {t.schemaApplyJson}
                </Button>
              </div>
            </InputGroupAddon>
          </InputGroup>
        </TabsContent>
      </Tabs>
      {error ? <FieldError>{error.replace(/^json:/, "")}</FieldError> : null}
    </Field>
  )
}

function SchemaNodeEditor({
  schema,
  onChange,
  depth = 0,
}: SchemaNodeEditorProps) {
  const { dictionary } = useLocalization()
  const t = dictionary.systemPrompts
  const schemaObject = isJsonObject(schema)
    ? schema
    : createSchemaForType("object")
  const type = getSchemaType(schemaObject) ?? "object"
  const nullable = getSchemaNullable(schemaObject)
  const isNested = depth > 0

  function updateSchema(next: JsonObject) {
    onChange(next)
  }

  function handleTypeChange(nextType: SystemPromptSchemaType) {
    onChange(createSchemaForType(nextType, { nullable }))
  }

  function handleNullableChange(checked: boolean) {
    const nextSchema = { ...schemaObject }

    if (checked) {
      if (Array.isArray(nextSchema.type)) {
        nextSchema.type = nextSchema.type.includes("null")
          ? nextSchema.type
          : [...nextSchema.type, "null"]
      } else {
        nextSchema.nullable = true
      }
    } else {
      delete nextSchema.nullable

      if (Array.isArray(nextSchema.type)) {
        nextSchema.type = type
      }
    }

    onChange(nextSchema)
  }

  return (
    <div
      className={
        isNested
          ? "flex flex-col gap-4 rounded-lg border p-4"
          : "flex flex-col gap-4 rounded-lg border p-4"
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Field className="sm:max-w-56">
          <FieldLabel>{t.schemaType}</FieldLabel>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SYSTEM_PROMPT_SCHEMA_TYPES.map((schemaType) => (
                  <SelectItem key={schemaType} value={schemaType}>
                    {t.schemaTypeLabels[schemaType]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field orientation="horizontal" className="sm:w-auto">
          <Checkbox
            checked={nullable}
            onCheckedChange={(checked) =>
              handleNullableChange(checked === true)
            }
            aria-label={t.schemaNullable}
          />
          <FieldLabel>{t.schemaNullable}</FieldLabel>
        </Field>
      </div>

      {type === "object" ? (
        <ObjectSchemaEditor
          schema={schemaObject}
          depth={depth}
          onChange={updateSchema}
        />
      ) : null}
      {type === "array" ? (
        <ArraySchemaEditor
          schema={schemaObject}
          depth={depth}
          onChange={updateSchema}
        />
      ) : null}
      {type === "string" ? (
        <StringSchemaEditor schema={schemaObject} onChange={updateSchema} />
      ) : null}
      {type === "number" ? (
        <NumberSchemaEditor schema={schemaObject} onChange={updateSchema} />
      ) : null}
    </div>
  )
}

function ObjectSchemaEditor({
  schema,
  depth,
  onChange,
}: {
  schema: JsonObject
  depth: number
  onChange: (schema: JsonObject) => void
}) {
  const { dictionary } = useLocalization()
  const t = dictionary.systemPrompts
  const properties = getSchemaProperties(schema)
  const required = getSchemaRequired(schema)
  const entries = Object.entries(properties)
  const additionalProperties = schema.additionalProperties
  const hasMapSchema = isJsonObject(additionalProperties)

  function updateProperties(nextProperties: Record<string, JsonValue>) {
    onChange({
      ...schema,
      properties: nextProperties,
      required: required.filter((name) => name in nextProperties),
    })
  }

  function addProperty() {
    let index = entries.length + 1
    let nextName = `field_${index}`

    while (nextName in properties) {
      index += 1
      nextName = `field_${index}`
    }

    updateProperties({
      ...properties,
      [nextName]: createSchemaForType("string"),
    })
  }

  function updateRequired(name: string, checked: boolean) {
    const nextRequired = checked
      ? [...new Set([...required, name])]
      : required.filter((item) => item !== name)

    onChange({
      ...schema,
      required: nextRequired,
    })
  }

  function updateAdditionalProperties(value: JsonValue | undefined) {
    const nextSchema = { ...schema }

    if (value === undefined) {
      delete nextSchema.additionalProperties
    } else {
      nextSchema.additionalProperties = value
    }

    onChange(nextSchema)
  }

  return (
    <FieldGroup>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{t.schemaProperties}</p>
        <Button type="button" variant="outline" onClick={addProperty}>
          <Plus data-icon="inline-start" />
          {t.schemaAddProperty}
        </Button>
      </div>

      {entries.length > 0 ? (
        <div className="flex flex-col gap-3">
          {entries.map(([name, propertySchema]) => (
            <SchemaPropertyEditor
              key={name}
              name={name}
              schema={propertySchema}
              required={required.includes(name)}
              depth={depth + 1}
              onRequiredChange={(checked) => updateRequired(name, checked)}
              onNameChange={(nextName) => {
                if (!nextName || nextName === name) {
                  return
                }

                if (nextName in properties) {
                  return
                }

                const { [name]: current, ...rest } = properties
                const nextProperties = { ...rest, [nextName]: current }
                const nextRequired = required.map((item) =>
                  item === name ? nextName : item
                )

                onChange({
                  ...schema,
                  properties: nextProperties,
                  required: nextRequired,
                })
              }}
              onSchemaChange={(nextSchema) =>
                updateProperties({
                  ...properties,
                  [name]: nextSchema,
                })
              }
              onRemove={() => {
                const nextProperties = { ...properties }
                delete nextProperties[name]
                updateProperties(nextProperties)
              }}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          {t.schemaEmptyObject}
        </p>
      )}

      <Field orientation="horizontal">
        <Checkbox
          checked={schema.additionalProperties === true}
          onCheckedChange={(checked) => {
            updateAdditionalProperties(checked === true ? true : false)
          }}
          aria-label={t.schemaAdditionalProperties}
          disabled={hasMapSchema}
        />
        <FieldLabel>{t.schemaAdditionalProperties}</FieldLabel>
      </Field>

      {hasMapSchema ? (
        <Collapsible defaultOpen>
          <div className="flex items-center justify-between gap-3">
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost">
                <ChevronDown data-icon="inline-start" />
                {t.schemaMapItems}
              </Button>
            </CollapsibleTrigger>
            <Button
              type="button"
              variant="ghost"
              onClick={() => updateAdditionalProperties(false)}
            >
              <Trash2 data-icon="inline-start" />
              {t.schemaRemoveProperty}
            </Button>
          </div>
          <CollapsibleContent>
            <SchemaNodeEditor
              schema={additionalProperties}
              depth={depth + 1}
              onChange={updateAdditionalProperties}
            />
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            updateAdditionalProperties(createSchemaForType("string"))
          }
        >
          <Plus data-icon="inline-start" />
          {t.schemaMapItems}
        </Button>
      )}
    </FieldGroup>
  )
}

function SchemaPropertyEditor({
  name,
  schema,
  required,
  depth,
  onNameChange,
  onSchemaChange,
  onRequiredChange,
  onRemove,
}: {
  name: string
  schema: JsonValue
  required: boolean
  depth: number
  onNameChange: (name: string) => void
  onSchemaChange: (schema: JsonValue) => void
  onRequiredChange: (required: boolean) => void
  onRemove: () => void
}) {
  const { dictionary } = useLocalization()
  const t = dictionary.systemPrompts
  const [draftName, setDraftName] = useState(name)

  return (
    <Collapsible defaultOpen>
      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field className="sm:flex-1" data-invalid={!draftName.trim()}>
            <FieldLabel>{t.schemaFieldName}</FieldLabel>
            <Input
              value={draftName}
              placeholder={t.schemaFieldNamePlaceholder}
              aria-invalid={!draftName.trim()}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={() => onNameChange(draftName.trim())}
            />
            {!draftName.trim() ? (
              <FieldError>{t.schemaFieldNameRequired}</FieldError>
            ) : null}
          </Field>
          <Field orientation="horizontal" className="sm:w-auto">
            <Checkbox
              checked={required}
              onCheckedChange={(checked) => onRequiredChange(checked === true)}
              aria-label={t.schemaRequired}
            />
            <FieldLabel>
              {required ? t.schemaRequired : t.schemaOptional}
            </FieldLabel>
          </Field>
          <div className="flex gap-2">
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <ChevronDown data-icon="inline-start" />
                <span className="sr-only">{name}</span>
              </Button>
            </CollapsibleTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
            >
              <Trash2 data-icon="inline-start" />
              <span className="sr-only">{t.schemaRemoveProperty}</span>
            </Button>
          </div>
        </div>
        <CollapsibleContent>
          <SchemaNodeEditor
            schema={schema}
            depth={depth}
            onChange={onSchemaChange}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

function ArraySchemaEditor({
  schema,
  depth,
  onChange,
}: {
  schema: JsonObject
  depth: number
  onChange: (schema: JsonObject) => void
}) {
  const { dictionary } = useLocalization()
  const t = dictionary.systemPrompts
  const items = schema.items ?? createSchemaForType("string")

  return (
    <FieldGroup>
      <p className="text-sm font-medium">{t.schemaItems}</p>
      {items ? (
        <SchemaNodeEditor
          schema={items}
          depth={depth + 1}
          onChange={(nextItems) => onChange({ ...schema, items: nextItems })}
        />
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          {t.schemaEmptyArray}
        </p>
      )}
    </FieldGroup>
  )
}

function StringSchemaEditor({
  schema,
  onChange,
}: {
  schema: JsonObject
  onChange: (schema: JsonObject) => void
}) {
  const { dictionary } = useLocalization()
  const t = dictionary.systemPrompts

  function updateMinLength(value: string) {
    const nextSchema = { ...schema }

    if (value.trim() === "") {
      delete nextSchema.minLength
      onChange(nextSchema)
      return
    }

    const minLength = Number(value)

    if (!Number.isFinite(minLength) || minLength < 0) {
      return
    }

    nextSchema.minLength = minLength
    onChange(nextSchema)
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field>
        <FieldLabel>{t.schemaEnum}</FieldLabel>
        <Input
          value={getStringEnumValues(schema)}
          placeholder={t.schemaEnumPlaceholder}
          onChange={(event) => {
            const values = event.target.value
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean)
            const nextSchema = { ...schema }

            if (values.length > 0) {
              nextSchema.enum = values
            } else {
              delete nextSchema.enum
            }

            onChange(nextSchema)
          }}
        />
      </Field>
      <Field>
        <FieldLabel>{t.schemaMinLength}</FieldLabel>
        <Input
          type="number"
          min={0}
          step={1}
          value={getStringMinLengthValue(schema)}
          onChange={(event) => updateMinLength(event.target.value)}
        />
      </Field>
    </div>
  )
}

function NumberSchemaEditor({
  schema,
  onChange,
}: {
  schema: JsonObject
  onChange: (schema: JsonObject) => void
}) {
  const { dictionary } = useLocalization()
  const t = dictionary.systemPrompts

  function updateNumberConstraint(key: "minimum" | "maximum", value: string) {
    const nextSchema = { ...schema }

    if (value.trim() === "") {
      delete nextSchema[key]
    } else {
      nextSchema[key] = Number(value)
    }

    onChange(nextSchema)
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field>
        <FieldLabel>{t.schemaMinimum}</FieldLabel>
        <Input
          type="number"
          value={typeof schema.minimum === "number" ? schema.minimum : ""}
          onChange={(event) =>
            updateNumberConstraint("minimum", event.target.value)
          }
        />
      </Field>
      <Field>
        <FieldLabel>{t.schemaMaximum}</FieldLabel>
        <Input
          type="number"
          value={typeof schema.maximum === "number" ? schema.maximum : ""}
          onChange={(event) =>
            updateNumberConstraint("maximum", event.target.value)
          }
        />
      </Field>
    </div>
  )
}
