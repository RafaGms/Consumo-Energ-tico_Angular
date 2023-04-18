import { Component } from '@angular/core';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})
export class ConsumoComponent {

  residentes!: number; // quantidade residente
  inputMaquina!: string; // input da maquina
  inputSecadora!: string; // input secadora
  maquina!: boolean; // se houver máquina de lavar
  secadora!: boolean; // se houver secador
  comodos!: number;
  tvs!: number; // quantidade de tv
  pcs!: number; // quantidade de tv
  consumo: number = 0;
  precoHora!: number; // preço por hora
  precoPagar!: number; // consumo * preçoPorHora
  result!: string; // frase + preçoParaPagar
  errorMessage!: string;

  // Dados de watts de casa produto
  mediaWatts: any = { //watts
    'room': 10, // 10w por lampada 
    'maquina': 1500, //500W - 2500W
    'secadora': 3000, //1000W - 5000W
    'pc': 350, // 100W - 500W (desktop)
    'tv': 125, //50W - 200W
    'shower': 3500 //3000W - 8500W
  };
  mediaTempo: any = { //hora por mês para cada pessoa considerando um dispositivo
    'room': (4*30), //4 horas por dia * 30 dias
    'maquina': (2*4), //1 - 3 semanas (1 hora por uso) * 4 semanas
    'secadora': (2*4), //1 - 3 semanas (1 hora por uso) * 4 semanas
    'pc': (3*30), //2 - 4 horas por dia * 30 dias
    'tv': (4*30), //3 - 5 horas por dia * 30 dias
    'shower': ((10/60)*30) //(10 minutos por dia / 60) * 30 dias
  }

  setErrorMessage(message: string){
    this.errorMessage = message;
  }

  validateInputs(): void {
    this.consumo = 0;
    
    if (this.inputMaquina === 'false' || this.inputMaquina === undefined) {
      this.maquina = false;
      this.inputMaquina = 'false';
    }
    else{
      this.maquina = true;
      this.inputMaquina = 'true';
    }

    if (this.inputSecadora === 'false' || this.inputSecadora === undefined) {
      this.secadora = false;
      this.inputSecadora = 'false';
    }
    else{
      this.secadora = true;
      this.inputSecadora = 'true';
    }

    if (this.residentes >= 0 && this.tvs >= 0 && this.pcs >= 0 && this.precoHora >= 0 && this.comodos >= 0) {
      this.result = this.getResult();
    }
    else {
      this.setErrorMessage('Preencha os campos');
    }
  }

  getResult(): string {
    
    if (this.maquina === true){
      this.consumo += this.mediaWatts['maquina'] *  this.mediaTempo['maquina'];
    }

    if (this.secadora === true){
      this.consumo += this.mediaWatts['secadora'] * this.mediaTempo['secadora'];
    }

    this.consumo += (this.mediaWatts['room'] * this.mediaTempo['room']) * this.comodos;
    this.consumo += (this.mediaWatts['pc'] * this.mediaTempo['pc']) * this.pcs;
    this.consumo += (this.mediaWatts['tv'] * this.mediaTempo['tv']) * this.tvs;
    this.consumo += (this.mediaWatts['shower'] * this.mediaTempo['shower']) * this.residentes;
    
    //converrte Wh para kWh:
    this.consumo /= 1000;

    this.precoPagar = this.consumo * this.precoHora;
    
    return `Você gasta em média <span class="text-warning">${this.consumo}kWh</span> mensais, que da aproximadamente <span class="text-success">R$${this.precoPagar.toFixed(2)}</span> para pagar.`;
  }
}
