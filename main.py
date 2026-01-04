import numpy as np
import random
import time
from scipy.stats import chi2, norm

class RNGBackend:
    def __init__(self, n_samples=1000):
        self.n = n_samples

    def generate_lcg(self):
        """
        LCG dengan Dinamis Seed berdasarkan timestamp agar 
        angka pertama tidak selalu 0.5971.
        """
        # Mengambil angka mikrodetik sebagai seed agar sangat acak
        seed = int(time.time() * 1000) % 100000
        
        m = 2**31
        a = 1103515245
        c = 12345
        
        numbers = []
        x = seed
        for _ in range(self.n):
            x = (a * x + c) % m
            numbers.append(round(x / m, 4))
        return numbers

    def generate_system(self):
        return [round(random.random(), 4) for _ in range(self.n)]

    def evaluasi(self, data):
        # 1. Uji Uniformitas
        obs, _ = np.histogram(data, bins=10, range=(0, 1))
        exp = self.n / 10
        chi_stat = sum((obs - exp)**2 / exp)
        p_unif = 1 - chi2.cdf(chi_stat, df=9)
        
        # 2. Uji Runs
        runs = 1
        for i in range(1, self.n):
            if (data[i] > data[i-1]) != (data[i-1] > data[i-2] if i > 1 else True):
                runs += 1
        mu_r = (2 * self.n - 1) / 3
        sig_r = np.sqrt((16 * self.n - 29) / 90)
        z_stat = abs((runs - mu_r) / sig_r)
        p_runs = 2 * (1 - norm.cdf(z_stat))

        # 3. Autokorelasi
        r = np.corrcoef(data[:-1], data[1:])[0, 1]
        
        return {
            "p_unif": float(p_unif),
            "status_unif": "LULUS" if p_unif > 0.05 else "GAGAL",
            "p_runs": float(p_runs),
            "status_runs": "LULUS" if p_runs > 0.05 else "GAGAL",
            "r_val": float(r),
            "status_auto": "LULUS" if abs(r) < 0.2 else "GAGAL",
            "full_data": data
        }