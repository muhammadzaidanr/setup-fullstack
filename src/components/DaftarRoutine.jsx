import CardRoutine from "./CardRoutine";

function DaftarRoutine({
  daftarRoutine,
  onEdit,
  onHapus,
  disabled,
}) {
  return (
    <section>
      <h2>Daftar Routine</h2>

      {daftarRoutine.length === 0 ? (
        <p>Belum ada data routine.</p>
      ) : (
        daftarRoutine.map((routine) => (
          <CardRoutine
            key={routine.id}
            routine={routine}
            onEdit={onEdit}
            onHapus={onHapus}
            disabled={disabled}
          />
        ))
      )}
    </section>
  );
}

export default DaftarRoutine;