import React from "react";
import "./Home.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="image-container">
        <img
          src="/public/images/homepic.png"
          alt="Clinic"
          className="clinic-image"
        />
      </div>
      <div className="home-content">
        <h1 className="welcome-title">Patişah Veteriner Kliniği</h1>
        <p className="description">
          <p>
            Veteriner bakım kliniği arayışında, yalnızca olağanüstü bakım ve
            mükemmel hizmeti hak ediyorsunuz. Portland, Oregon'daki Pati ve
            Pençe Veteriner Hastanesi olarak, sevgili dostunuz için en yüksek
            kalitede sağlık hizmetini sunmak için deneyimli bir veteriner
            profesyonellerinden oluşan bir ekip bir araya getirdik.
          </p>
          <p>
            Mükemmelliğe olan bağlılığımız, dostunuzun bireysel ihtiyaçlarına
            uygun olarak kişisel tedavi ve şefkatli ilgi sunacakları anlamına
            gelir. Rutin kontrollerden, önleyici bakıma ve özel tıbbi tedaviye
            kadar, deneyimli ekibimize her adımda üstün veteriner bakımını
            güvenle teslim edebilirsiniz.
          </p>
          <p>
            Sevgili dostunuzun sağlığı bizim önceliğimizdir ve onların bakımında
            güvenilir ortağınız olmaktan onur duyarız. Kaliteli veteriner
            bakımının farkını yaşayın. Bugün bize bir randevu ayarlayın ve
            dostunuzun hak ettiği olağanüstü bakımı sağlamamıza izin verin.
          </p>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
