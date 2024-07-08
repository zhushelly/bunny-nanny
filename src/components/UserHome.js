import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import Header from './Header';
import BunnyCard from './BunnyCard';
import Filter from './Filter';

const UserHome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Header user={user} />
      <main>
        <section>
          <h2>Bunny looking for nanny:</h2>
          <div className="bunny-list">
            <BunnyCard location="SB, CA" image="sb-ca-bunny.png" />
            <BunnyCard location="LA, CA" image="la-ca-bunny.png" />
            <BunnyCard location="SD, CA" image="sd-ca-bunny.png" />
          </div>
        </section>
        <aside>
          <Filter />
        </aside>
      </main>
    </div>
  );
};

export default UserHome;
