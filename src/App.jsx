import { useEffect, useState } from "react";

import Header from "./components/Header";
import FormRoutine from "./components/FormRoutine";
import DaftarRoutine from "./components/DaftarRoutine";
import RingkasanRoutine from "./components/RingkasanRoutine";

const API_URL = "http://localhost:3001/routines";

const FORM_AWAL = {
  nama: "",
  fokus: "",
  tanggalLatihan: "",
  tingkat: "pemula",
  selesai: false,
};

async function requestApi(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);

  // DELETE dari backend tidak memiliki body JSON.
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    // Exception filter modul membungkus pesan bawaan NestJS.
    const message = data.message?.message ?? data.message;

    const teksError = Array.isArray(message)
      ? message.join(" ")
      : typeof message === "string"
        ? message
        : `Permintaan gagal: HTTP ${response.status}`;

    throw new Error(teksError);
  }

  return data;
}

function App() {
  const [daftarRoutine, setDaftarRoutine] = useState([]);
  const [form, setForm] = useState(FORM_AWAL);
  const [idEdit, setIdEdit] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sibuk, setSibuk] = useState(false);
  const [error, setError] = useState("");
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function muatRoutine() {
      try {
        const data = await requestApi("", {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setDaftarRoutine(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    muatRoutine();

    return () => controller.abort();
  }, []);

  function ubahInput(event) {
    const { name, value, type, checked } = event.target;

    setForm((sebelumnya) => ({
      ...sebelumnya,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(FORM_AWAL);
    setIdEdit(null);
  }

  function mulaiEdit(routine) {
    setIdEdit(routine.id);

    setForm({
      nama: routine.nama,
      fokus: routine.fokus,
      tanggalLatihan: routine.tanggalLatihan?.slice(0, 10) ?? "",
      tingkat: routine.tingkat,
      selesai: routine.selesai,
    });

    setError("");
    setPesan("");
  }

  async function simpanRoutine(event) {
    event.preventDefault();

    setSibuk(true);
    setError("");
    setPesan("");

    const payload = {
      nama: form.nama.trim(),
      fokus: form.fokus.trim(),
      tanggalLatihan: form.tanggalLatihan || null,
      tingkat: form.tingkat,
    };

    // Status selesai hanya dikirim saat update,
    // sesuai UpdateRoutineDto.
    if (idEdit) {
      payload.selesai = form.selesai;
    }

    try {
      const hasil = await requestApi(
        idEdit ? `/${idEdit}` : "",
        {
          method: idEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (idEdit) {
        setDaftarRoutine((sebelumnya) =>
          sebelumnya.map((routine) =>
            routine.id === hasil.id ? hasil : routine,
          ),
        );

        setPesan("Routine berhasil diubah.");
      } else {
        setDaftarRoutine((sebelumnya) => [
          hasil,
          ...sebelumnya,
        ]);

        setPesan("Routine berhasil ditambahkan.");
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSibuk(false);
    }
  }

  async function hapusRoutine(id) {
    setSibuk(true);
    setError("");
    setPesan("");

    try {
      await requestApi(`/${id}`, {
        method: "DELETE",
      });

      setDaftarRoutine((sebelumnya) =>
        sebelumnya.filter((routine) => routine.id !== id),
      );

      if (idEdit === id) {
        resetForm();
      }

      setPesan("Routine berhasil dihapus.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSibuk(false);
    }
  }

  return (
    <main>
      <Header judul="SetUp Fullstack" />

      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
      )}

      {pesan && <p role="status">{pesan}</p>}

      <FormRoutine
        form={form}
        sedangEdit={idEdit !== null}
        disabled={loading || sibuk}
        onChange={ubahInput}
        onSubmit={simpanRoutine}
        onBatal={resetForm}
      />

      <RingkasanRoutine jumlah={daftarRoutine.length} />

      {loading ? (
        <p role="status">Memuat routine dari backend...</p>
      ) : (
        <DaftarRoutine
          daftarRoutine={daftarRoutine}
          onEdit={mulaiEdit}
          onHapus={hapusRoutine}
          disabled={sibuk}
        />
      )}
    </main>
  );
}

export default App;