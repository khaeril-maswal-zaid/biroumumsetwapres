<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDaftarRuanganRequest extends FormRequest
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
            'nama_ruangan'  => 'required|string|max:255',
            'kode_ruangan'  => 'required|string|max:255|unique:daftar_ruangans,kode_ruangan',
            'lokasi'        => 'nullable|string|max:255',
            'kapasitas'     => 'nullable|string|max:255',
            'photo'         => 'nullable|file|image|mimes:jpg,jpeg,png,webp|max:5150',
            'status'        => 'nullable|in:aktif,maintenance,nonaktif',
            'fasilitas'     => 'nullable|array',
            'fasilitas.*'   => 'string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_ruangan.required' => 'Nama ruangan wajib diisi.',
            'nama_ruangan.max'      => 'Nama ruangan maksimal 255 karakter.',
            'kode_ruangan.required' => 'Kode ruangan wajib diisi.',
            'kode_ruangan.unique'   => 'Kode ruangan sudah digunakan.',
            'kode_ruangan.max'      => 'Kode ruangan maksimal 255 karakter.',
            'lokasi.max'            => 'Lokasi maksimal 255 karakter.',

            'photo.file'            => 'Foto harus berupa file.',
            'photo.photo'           => 'Foto harus berupa gambar.',
            'photo.mimes'           => 'Foto harus berformat jpg, jpeg, png, webp, gif, atau svg.',
            'photo.max'             => 'Ukuran foto maksimal 2MB.',
            'status.in'             => 'Status harus salah satu dari: aktif, maintenance, nonaktif.',
            'fasilitas.array'       => 'Fasilitas harus dalam bentuk array.',
            'fasilitas.*.string'    => 'Setiap fasilitas harus berupa teks.',
        ];
    }
}
