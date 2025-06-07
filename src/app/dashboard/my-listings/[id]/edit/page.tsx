"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const statuses = ["OPEN", "CLOSED", "DRAFT"];
const types = ["SPONSORSHIP", "COLLABORATION", "PARTNERSHIP"];
const categoriesList = [
  "Gaming",
  "Technology",
  "Health & Fitness",
  "Food & Cooking",
  "Travel",
  "Sports",
  "Arts",
  "Community",
  "Music",
];

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
          type: data.type,
          budget: data.budget,
          requirements: data.requirements,
          perks: data.perks,
          categories: data.categories
            .map((c: any) => c.category?.name || c.name)
            .filter((name: string | undefined) => !!name),
          status: data.status,
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, idx: number, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (i === idx ? value : item)),
    }));
  };

  const handleAddArrayItem = (field: string) => {
    setForm((prev: any) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveArrayItem = (field: string, idx: number) => {
    setForm((prev: any) => ({ ...prev, [field]: prev[field].filter((_: any, i: number) => i !== idx) }));
  };

  const handleCategoryToggle = (cat: string) => {
    setForm((prev: any) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c: string) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`/api/listings/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update listing");
      }
      router.push("/dashboard/my-listings");
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium">Title</label>
          <input
            className="w-full border rounded p-2"
            value={form.title}
            onChange={e => handleChange("title", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={form.description}
            onChange={e => handleChange("description", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Type</label>
          <select
            className="w-full border rounded p-2"
            value={form.type}
            onChange={e => handleChange("type", e.target.value)}
          >
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Budget</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              className="w-full border rounded p-2 pl-7"
              type="number"
              value={form.budget}
              onChange={e => handleChange("budget", e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Status</label>
          <select
            className="w-full border rounded p-2"
            value={form.status}
            onChange={e => handleChange("status", e.target.value)}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Requirements</label>
          <div className="space-y-2">
            {form.requirements.map((req: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  className="w-full border rounded p-2"
                  value={req}
                  onChange={e => handleArrayChange("requirements", idx, e.target.value)}
                  required
                />
                <button type="button" onClick={() => handleRemoveArrayItem("requirements", idx)} className="text-red-600 px-2 py-1 rounded hover:bg-red-50 border-2 border-red-400">Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => handleAddArrayItem("requirements")}
            className="mt-2 px-3 py-1 bg-primary text-white rounded hover:opacity-90">Add Requirement</button>
        </div>
        <div>
          <label className="block font-medium">Perks</label>
          <div className="space-y-2">
            {form.perks.map((perk: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  className="w-full border rounded p-2"
                  value={perk}
                  onChange={e => handleArrayChange("perks", idx, e.target.value)}
                  required
                />
                <button type="button" onClick={() => handleRemoveArrayItem("perks", idx)} className="text-red-600 px-2 py-1 rounded hover:bg-red-50 border-2 border-red-400">Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => handleAddArrayItem("perks")}
            className="mt-2 px-3 py-1 bg-primary text-white rounded hover:opacity-90">Add Perk</button>
        </div>
        <div>
          <label className="block font-medium mb-2">Categories</label>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map(cat => {
              const selected = form.categories.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-4 py-1 rounded-full border transition-colors duration-150 text-sm font-medium focus:outline-none
                    ${selected ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary/10'}`}
                  style={{ outline: selected ? '2px solid var(--primary)' : undefined }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
} 