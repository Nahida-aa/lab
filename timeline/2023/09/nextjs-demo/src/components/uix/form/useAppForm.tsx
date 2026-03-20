
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'

import { createFormHook, type FieldApi } from '@tanstack/react-form'

import type React from 'react'

import {
  fieldContext,
  Form,
  formContext,
  FormFloatingSaveBar,
  NextButton,
  SubmitButton,
  useFieldContext,
  useFormContext,
} from './form'
import {

  fieldComponents,
} from './fields'
import { dev } from '@/lib/env/base'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents,
  formComponents: {
    NextButton,
    SubmitButton,
    Form,
    FormFloatingSaveBar,
    Devtool: dev
      ? () => {
          const form = useFormContext()
          return (
            <form.Subscribe
              children={state => {
                console.log(state)
                return null
              }}
            />
          )
        }
      : () => null,
  },
})
export const FileItem = ({
  children,
  file,
}: {
  children?: React.ReactNode
  file: File
}) => {
  return (
    <Item variant="muted" size="sm">
      <ItemContent>
        <ItemTitle>{file.name}</ItemTitle>
      </ItemContent>
      <ItemActions>{children}</ItemActions>
    </Item>
  )
}
