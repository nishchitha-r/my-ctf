"use client";

export default function DeletePlayersButton() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const confirmed = window.confirm(
      "WARNING!\n\nThis will permanently delete ALL players and their submissions.\n\nAre you sure you want to continue?"
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <form
      action="/api/admin/delete-players"
      method="POST"
      onSubmit={handleSubmit}
    >
      <button
        type="submit"
        className="mt-4 border border-red-700 px-6 py-3 font-bold tracking-widest text-red-700 transition hover:bg-red-700 hover:text-black"
      >
        DELETE ALL PLAYERS
      </button>
    </form>
  );
}