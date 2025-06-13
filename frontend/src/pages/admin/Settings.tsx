import React, { useState } from "react";
import Swal from "sweetalert2"

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    password: "",
  });
  const [preferences, setPreferences] = useState({
    theme: "light",
    notifications: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };



  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Save settings logic here
     Swal.fire({
  title: "Do you want to save the changes?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "Save",
  denyButtonText: `Don't save`
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    Swal.fire("Saved!", "", "success");
  } else if (result.isDenied) {
    Swal.fire("Changes are not saved", "", "info");
  }
});
    
  };

  return (
    <div className="settings-container" style={{ maxWidth: 600, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ marginBottom: 24, color: "#1e293b" }}>Settings</h2>
      <form onSubmit={handleSubmit}>
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ color: "#334155" }}>Profile</h3>
          <div style={{ marginBottom: 16 }}>
            <label className="text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="input text-sm"
              style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #cbd5e1" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="input text-sm"
              style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #cbd5e1" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="text-sm">New Password</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleProfileChange}
              className="input text-sm"
              style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #cbd5e1" }}
              placeholder="Leave blank to keep current password"
            />
          </div>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ color: "#334155" }}>Preferences</h3>
          <div style={{ marginBottom: 16 }}>
            <label className="text-sm">Theme</label>
            <select
              name="theme"
              value={preferences.theme}
              onChange={handlePreferencesChange}
              className="input text-sm"
              style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #cbd5e1" }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="text-sm" style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name="notifications"
                checked={preferences.notifications}
                onChange={handlePreferencesChange}
                style={{ marginRight: 8 }}
              />
              Enable notifications
            </label>
          </div>
        </section>
        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "10px 24px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;