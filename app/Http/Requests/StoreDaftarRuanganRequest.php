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
            'kapasitas'     => 'nullable|integer|min:0',
            'image'         => 'nullable|file|image|mimes:jpg,jpeg,png,webp|max:2048',
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
            'kapasitas.integer'     => 'Kapasitas harus berupa angka.',
            'kapasitas.min'         => 'Kapasitas tidak boleh negatif.',
            'image.file'            => 'Foto harus berupa file.',
            'image.image'           => 'Foto harus berupa gambar.',
            'image.mimes'           => 'Foto harus berformat jpg, jpeg, png, webp, gif, atau svg.',
            'image.max'             => 'Ukuran foto maksimal 2MB.',
            'status.in'             => 'Status harus salah satu dari: aktif, maintenance, nonaktif.',
            'fasilitas.array'       => 'Fasilitas harus dalam bentuk array.',
            'fasilitas.*.string'    => 'Setiap fasilitas harus berupa teks.',
        ];
    }
}
