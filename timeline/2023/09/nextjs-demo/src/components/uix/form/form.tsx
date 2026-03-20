import { type AnyFieldMeta, createFormHookContexts, FieldApi } from '@tanstack/react-form'
import { toastError } from '../toast'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast, Toaster } from 'sonner'
import { useEffect, useState } from 'react'
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const Form = ({
  className,
  children,
  onSubmit,
  id,
}: {
  className?: string
  children: React.ReactNode
  onSubmit?: () => void | Promise<void>
  id?: string
}) => {
  return (
    <form
      className={className}
      onSubmit={async e => {
        e.preventDefault()
        try {
          await onSubmit?.()
        } catch (error) {
          toastError(error)
        }
      }}
      id={id}
    >
      {children}
    </form>
  )
}
export const SubmitButton = ({
  label = '提交',
  icon,
  className,
  form: formId,
  canSubmitDefault = false,
}: {
  label?: string
  className?: string
  icon?: React.ReactNode
  form?: string
  canSubmitDefault?: boolean
}) => {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={state => {
        return {
          canNext: state.errors.length === 0,
          isSubmitting: state.isSubmitting,
          isDefaultValue: state.isDefaultValue,
        }
      }}
    >
      {({ canNext, isSubmitting, isDefaultValue }) => (
        <Button
          type="submit"
          disabled={isSubmitting || !canNext || (isDefaultValue && !canSubmitDefault)}
          className={className}
          form={formId}
        >
          {icon ? (
            <span className={`shrink-0 ${isSubmitting && 'animate-spin'}`}>{icon}</span>
          ) : (
            isSubmitting && <Spinner />
          )}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

// return a form.Subscribe.selector
const selector =
  ({
    isFirstStep = true,
    currentFields,
  }: {
    isFirstStep: boolean
    currentFields: 'all' | readonly string[]
  }) =>
  (state: ReturnType<typeof useFormContext>['state']) => {
    let hasErrors = false
    let isTouched = false
    for (const field of currentFields) {
      const meta = (state.fieldMeta as Record<string, AnyFieldMeta>)[field]
      if (meta) {
        if (meta.errors.length > 0) hasErrors = true
        if (meta.isTouched) isTouched = true
      }
      // 早停：如果已确定 hasErrors 和 hasTouched，都 true 时停止
      if (hasErrors && isTouched) break
    }
    return {
      canNext: !(hasErrors || (isFirstStep && !isTouched)),
      isTouched,
      isSubmitting: state.isSubmitting,
    }
  }

export const NextButton = ({
  label = '下一步',
  isFirstStep = true,
  currentFields,
  handleNext,
}: {
  label?: string
  isFirstStep: boolean
  currentFields: readonly string[]
  handleNext: () => void | Promise<void>
}) => {
  const form = useFormContext()
  return (
    <form.Subscribe selector={selector({ isFirstStep, currentFields })}>
      {({ canNext, isTouched }) =>
        (!isFirstStep || isTouched) && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleNext}
            disabled={!canNext}
          >
            {label}
            <ChevronRight />
          </Button>
        )
      }
    </form.Subscribe>
  )
}
export const FloatingSaveBar = ({
  view,
  isSubmitting,
  reset,
  isSubmitSuccessful,
}: {
  view: boolean
  isSubmitting: boolean
  reset: () => void
  isSubmitSuccessful: boolean
}) => {
  const TOAST_ID = 'floating-save-bar'
  useEffect(() => {
    console.log('FloatingSaveBar.useEffect:', view)
    if (view) {
      toast(
        <div className="flex justify-between items-center w-full">
          <span className="text-foreground">注意！您尚未保存更改！</span>
          <div className="flex items-center">
            <Button
              variant="link"
              onClick={() => {
                reset()
                // toast.dismiss(TOAST_ID)
              }}
            >
              重置
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}保存更改
            </Button>
          </div>
        </div>,
        {
          id: TOAST_ID,
          toasterId: 'form',
          classNames: {
            toast: 'py-2.5',
            content: cn('w-full'),
          },
        },
        // invert: false Dark toast in light mode and vice versa.
        // If 'false', it'll prevent the user from dismissing the toast.
      )
    } else {
      toast.dismiss(TOAST_ID)
    }
  }, [view, isSubmitting, reset])
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
      toast.dismiss(TOAST_ID)
    }
  }, [isSubmitSuccessful, reset])

  return <Toaster id="form" position="bottom-center" richColors duration={Infinity} />
}
export const FormFloatingSaveBar = ({
  watchedFields,
}: {
  watchedFields?: readonly string[]
}) => {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={state => {
        if (!watchedFields) {
          return {
            view: state.isDirty && state.errors.length === 0 && !state.isDefaultValue,
            isSubmitSuccessful: state.isSubmitSuccessful,
            isSubmitting: state.isSubmitting,
          }
        }
        let hasErrors = false
        let isDirty = false
        let isDefaultValue = true
        // TODO: 注意检查是否存在逻辑错误
        for (const field of watchedFields) {
          const meta = (state.fieldMeta as Record<string, AnyFieldMeta>)[field]
          if (meta) {
            if (meta.errors.length > 0) hasErrors = true
            if (meta.isDirty) isDirty = true
            if (!meta.isDefaultValue) isDefaultValue = false
          }

          if (!hasErrors && isDirty && !isDefaultValue) break
        }
        return {
          view: isDirty && !hasErrors && !isDefaultValue,
          isSubmitSuccessful: state.isSubmitSuccessful,
          isSubmitting: state.isSubmitting,
        }
      }}
    >
      {({ view, isSubmitting, isSubmitSuccessful }) => (
        <FloatingSaveBar
          view={view}
          isSubmitting={isSubmitting}
          reset={form.reset}
          isSubmitSuccessful={isSubmitSuccessful}
        />
      )}
    </form.Subscribe>
  )
}
