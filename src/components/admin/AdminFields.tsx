import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { supabase } from '../../lib/supabase'
import type { ServiceIconName } from '../../types/site'

const serviceIcons: ServiceIconName[] = ['Hammer', 'Droplets', 'House', 'Fence', 'Grid2x2', 'ClipboardList']

type TextInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}

export function TextInput({ label, value, onChange, type = 'text' }: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <input
        type={type}
        className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export function PasswordInput({ label, value, onChange }: TextInputProps) {
  return <TextInput label={label} type="password" value={value} onChange={onChange} />
}

type TextAreaInputProps = {
  label: string
  value: string
  rows?: number
  onChange: (value: string) => void
}

export function TextAreaInput({ label, value, rows = 4, onChange }: TextAreaInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <textarea
        rows={rows}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

type IconSelectProps = {
  label: string
  value: ServiceIconName
  onChange: (value: ServiceIconName) => void
}

export function IconSelect({ label, value, onChange }: IconSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select
        className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
        value={value}
        onChange={(event) => onChange(event.target.value as ServiceIconName)}
      >
        {serviceIcons.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>
    </label>
  )
}

type ImageUploadFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void | Promise<void>
  uploadPath: string
}

export function ImageUploadField({ label, value, onChange, uploadPath }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState(false)

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsUploading(true)
    setUploadError(false)
    setUploadMessage('')

    try {
      const uploadedUrl = await uploadImageToStorage(file, uploadPath)
      await onChange(uploadedUrl)
      setUploadMessage('Image uploaded to Supabase Storage.')
    } catch (error) {
      setUploadError(true)
      setUploadMessage(`Upload failed. ${getErrorMessage(error)}`)
    }

    setIsUploading(false)
    event.target.value = ''
  }

  return (
    <div className="space-y-3">
      <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <img src={value} alt={label} className="h-48 w-full rounded-[1.5rem] border border-slate-200 object-cover bg-stone-100" />
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <input
          className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/public-image.jpg or https://..."
        />
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800">
          {isUploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
      <p className="text-sm leading-6 text-slate-500">
        You can paste a public image path or upload a file directly. Uploaded files are stored in Supabase Storage and saved as image URLs.
      </p>
      {uploadMessage ? (
        <p className={`text-sm leading-6 ${uploadError ? 'text-red-600' : 'text-emerald-700'}`}>{uploadMessage}</p>
      ) : null}
    </div>
  )
}

async function uploadImageToStorage(file: File, uploadPath: string) {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
  const filePath = `${uploadPath}/${Date.now()}-${sanitizedName}`

  const uploadResult = await supabase.storage.from('site-assets').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (uploadResult.error) {
    throw uploadResult.error
  }

  const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath)
  if (!data.publicUrl) {
    throw new Error('Supabase returned an empty public URL for the uploaded image.')
  }

  return data.publicUrl
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error'
}
