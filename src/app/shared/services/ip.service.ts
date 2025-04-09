import { Injectable, computed, signal } from '@angular/core';
import { publicIpv4 } from 'public-ip';

@Injectable({
    providedIn: 'root',
})
export class IpService {
    #ipClient = signal<string>("");
    public ipClient = computed(() => this.#ipClient());
    
    constructor(){ }

    async initializeIp(): Promise<void> {
        this.#ipClient.set(await publicIpv4());
    }

    async getIpClient(): Promise<string> {
        return await publicIpv4();
    }
}
