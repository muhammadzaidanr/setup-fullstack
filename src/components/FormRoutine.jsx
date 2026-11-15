function FormRoutine({
  form,
  sedangEdit,
  disabled,
  onChange,
  onSubmit,
  onBatal,
}) {
  return (
    <section>
      <h2>
        {sedangEdit ? "Ubah Routine" : "Tambah Routine"}
      </h2>

      <form onSubmit={onSubmit}>
        <fieldset disabled={disabled}>
          <legend>Informasi Routine</legend>

          <div>
            <label htmlFor="nama">Nama routine:</label>
            <input
              id="nama"
              name="nama"
              type="text"
              value={form.nama}
              onChange={onChange}
              minLength={3}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label htmlFor="fokus">Fokus latihan:</label>
            <input
              id="fokus"
              name="fokus"
              type="text"
              value={form.fokus}
              onChange={onChange}
              minLength={3}
              maxLength={200}
              required
            />
          </div>

          <div>
            <label htmlFor="tanggalLatihan">
              Tanggal latihan:
            </label>
            <input
              id="tanggalLatihan"
              name="tanggalLatihan"
              type="date"
              value={form.tanggalLatihan}
              onChange={onChange}
            />
          </div>

          <div>
            <label htmlFor="tingkat">Tingkat:</label>
            <select
              id="tingkat"
              name="tingkat"
              value={form.tingkat}
              onChange={onChange}
            >
              <option value="pemula">Pemula</option>
              <option value="menengah">Menengah</option>
              <option value="lanjutan">Lanjutan</option>
            </select>
          </div>

          {sedangEdit && (
            <div>
              <label htmlFor="selesai">
                <input
                  id="selesai"
                  name="selesai"
                  type="checkbox"
                  checked={form.selesai}
                  onChange={onChange}
                />
                Latihan selesai
              </label>
            </div>
          )}

          <button type="submit">
            {disabled
              ? "Memproses..."
              : sedangEdit
                ? "Simpan Perubahan"
                : "Tambah"}
          </button>

          {sedangEdit && (
            <button type="button" onClick={onBatal}>
              Batal
            </button>
          )}
        </fieldset>
      </form>
    </section>
  );
}

export default FormRoutine;