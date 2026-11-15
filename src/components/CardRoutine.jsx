function CardRoutine({
  routine,
  onEdit,
  onHapus,
  disabled,
}) {
  return (
    <article>
      <h3>{routine.nama}</h3>

      <p>Fokus: {routine.fokus}</p>

      <p>
        Tanggal latihan:{" "}
        {routine.tanggalLatihan?.slice(0, 10) ??
          "Belum ditentukan"}
      </p>

      <p>Tingkat: {routine.tingkat}</p>

      <p>
        Status:{" "}
        {routine.selesai ? "Selesai" : "Belum selesai"}
      </p>

      <button
        type="button"
        onClick={() => onEdit(routine)}
        disabled={disabled}
      >
        Ubah
      </button>

      <button
        type="button"
        onClick={() => onHapus(routine.id)}
        disabled={disabled}
      >
        Hapus
      </button>
    </article>
  );
}

export default CardRoutine;