import { ElementRef, RefObject, useState } from 'react'
import { MemberSpotlight } from './MemberSpotlight'
import { ModalPopup } from './Modal'
import { brand } from 'lib/config/brand'
import { FieldMap } from 'lib/models'
import swr from 'swr'
import { JsonFetcher } from '../../lib/utils'

export type MemberModalProps = {
  memberId?: string
  isOpen?: boolean
  onClose?: () => void
  full?: boolean
  updateMeta?: boolean
  ref?: RefObject<Element & { focus: () => null }>
}

export function MemberModal({
  memberId,
  isOpen = false,
  onClose,
  ref,
  full = true,
  updateMeta = false,
}: MemberModalProps) {
  const { data: fields, isLoading } = swr<FieldMap>(`/api/site/fields/users`, JsonFetcher)
  if (isLoading) return null
  return (
    <>
      <ModalPopup
        size={brand.breakPoints}
        isOpen={isOpen}
        onClose={onClose}
        returnFocusOnClose={ref != undefined}
        finalFocusRef={ref}
      >
        {memberId && fields && (
          <MemberSpotlight id={memberId} fields={fields} full={full} updateMeta={updateMeta} />
        )}
      </ModalPopup>
    </>
  )
}
