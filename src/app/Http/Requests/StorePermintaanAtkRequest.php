<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePermintaanAtkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items'        => 'nullable|array',
            'justification' => 'required|string|max:255',
            'contact'      => 'required|string|max:15',
            // 'memo'         => 'required|file|mimes:pdf|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'items.array'         => 'Daftar kebutuhan harus berupa array.',
            'justification.required' => 'Deskripsi kebutuhan wajib diisi.',
            'contact.required'    => 'Nomor kontak wajib diisi.',
            'contact.max'         => 'Nomor kontak maksimal 15 karakter.',

            // Memo
            // 'memo.required'             => 'File memo wajib diupload.',
            // 'memo.file'                 => 'File memo tidak valid.',
            // 'memo.mimes'                => 'File memo harus berformat PDF.',
            // 'memo.max'                  => 'Ukuran file memo maksimal 2 MB.',
        ];
    }
}
