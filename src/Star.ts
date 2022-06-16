export enum Race {PROTOSS, ZERG, TERRAN}

export class Building {
    constructor(
        public name: string,
        public left: number,
        public right: number,
        public up: number,
        public down: number,
        public race: Race,
    ) {
    }

    toString = () => JSON.stringify(this, null, '  ');
}

export class Unit {
    constructor(
        public name: string,
        public width: number,
        public height: number,
        public race: Race,
    ) {
    }

    toString = () => JSON.stringify(this, null, '  ');
}