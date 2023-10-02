import React, { useState, useEffect } from "react"
import { Button as ButtonComponent, Input } from "@eco/stratos-components"
import { Tag } from "components/station/tag.type"
import { v4 as uuidv4 } from "uuid"

interface Props {
  selectedTags: string;
  setSelectedTags: React.Dispatch<React.SetStateAction<number | string>>;
}

export const TagElement = ({ selectedTags, setSelectedTags }: Props) => {
  const [tagsElement, setTagsElement] = useState<Tag[]>(
    Object.entries(JSON.parse(selectedTags)).map(([field, value]): Tag => {
      return { id: uuidv4() as string, field, value }
    })
  )

  useEffect(() => {
    const NameTag = tagsElement.find((tag) => tag.field === "name")
    if (NameTag) {
      setTagsElement(
        [NameTag].concat(tagsElement.filter((tag) => tag.field !== "name"))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ChangeFieldValue = (
    id: string,
    value: string,
    key: "field" | "value"
  ) => {
    const new_tags = tagsElement.map((tag) => {
      if (tag.id === id) {
        if (key === "field") {
          return { ...tag, field: value }
        }
        return { ...tag, value }
      }
      return tag
    })

    setTagsElement(new_tags)
    setSelectedTags(
      JSON.stringify(
        Object.assign(
          {},
          ...new_tags.map((item) => {
            if (item.field !== "") {
              return { [item.field as string]: item.value }
            }
          })
        )
      )
    )
  }

  const AddTag = () => {
    setTagsElement((prev) => [
      ...prev,
      { id: uuidv4() as string, field: "", value: "" },
    ])
  }

  const DeleteTag = (id: string) => {
    const updatedTags = tagsElement.filter((tag) => tag.id !== id)
    setTagsElement(updatedTags)
    setSelectedTags(
      JSON.stringify(
        Object.assign(
          {},
          ...updatedTags.map((item) => {
            if (item.field !== "") {
              return { [item.field as string]: item.value }
            }
          })
        )
      )
    )
  }

  return (
    <div>
      {tagsElement.length >= 0 ? (
        tagsElement.map((tag, index) => {
          return (
            <div className="grid grid-cols-10 gap-2" key={tag.id}>
              <div className="col-span-3">
                <Input
                  label=""
                  name="tagField"
                  hideLabel={true}
                  onChange={(e) =>
                    ChangeFieldValue(
                      tag.id,
                      (e.target as HTMLInputElement).value,
                      "field"
                    )
                  }
                  value={tag.field}
                  disabled={tag.field === "name" ? true : false}
                />
              </div>
              <div className="col-span-5">
                <Input
                  label="Hide Me"
                  name="name"
                  hideLabel={true}
                  onChange={(e) =>
                    ChangeFieldValue(
                      tag.id,
                      (e.target as HTMLInputElement).value,
                      "value"
                    )
                  }
                  value={tag.value as string | undefined}
                />
              </div>
              <div className="col-span-2 pt-1">
                {tag.field === "name" || tagsElement.length === 1 ? (
                  <></>
                ) : (
                  <ButtonComponent
                    iconName="fa-sharp fa-solid fa-trash"
                    variant="subtle-default"
                    hideLabel
                    onClick={() => DeleteTag(tag.id)}
                  >
                    Subtle Icon Only
                  </ButtonComponent>
                )}
                {tagsElement.length === index + 1 ? (
                  <ButtonComponent
                    iconName="fa-sharp fa-solid fa-circle-plus"
                    variant="subtle-default"
                    hideLabel
                    onClick={() => AddTag()}
                  >
                    Subtle Icon Only
                  </ButtonComponent>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <></>
      )}
    </div>
  )
}
