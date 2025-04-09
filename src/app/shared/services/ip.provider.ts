import { APP_INITIALIZER, inject } from '@angular/core';
import { IpService } from './ip.service';

export const provideIP = () => {
    return [
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
                const ips = inject(IpService);
                return () => ips.initializeIp();
            },
            multi: true,
        },
    ];
};
