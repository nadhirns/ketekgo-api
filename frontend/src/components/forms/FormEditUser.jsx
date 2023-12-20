import React from "react";

const FormEditUser = () => {
  return (
    <div>
      <h1 className="title">Users</h1>
      <h2 className="subtitle">Update User</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form>
              {/* name */}
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input type="text" className="input" placeholder="name" />
                </div>
              </div>
              {/* email */}
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input type="text" className="input" placeholder="email" />
                </div>
              </div>
              {/* password */}
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input type="password" className="input" placeholder="*****" />
                </div>
              </div>
              {/* conf-password */}
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input type="password" className="input" placeholder="*****" />
                </div>
              </div>
              {/* role */}
              <div className="field">
                <label className="label">Role</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select>
                      <option value="1">Admin</option>
                      <option value="2">Driver</option>
                      <option value="3">User</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* button */}
              <div className="field">
                <div className="control">
                  <button className="button is-danger" style={{ backgroundColor: "#D81D1D" }}>
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditUser;
