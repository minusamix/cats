export class CollisionManager {
    static checkBoxCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }
    static checkEllipseCollision(a, b) {
        const dx = (a.x + a.width / 2) - (b.x + b.width / 2);
        const dy = (a.y + a.height / 2) - (b.y + b.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (a.width / 2 + b.width / 2);
    }
    static checkCircleCollision(a, b) {
        const dx = (a.x + a.radius) - (b.x + b.radius);
        const dy = (a.y + a.radius) - (b.y + b.radius);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (a.radius + b.radius);
    }
    static checkCollision(colliderA, colliderB) {
        if (!colliderA.enabled || !colliderB.enabled) return false;
        if (colliderA.type === 'box' && colliderB.type === 'box') {
            return this.checkBoxCollision(colliderA, colliderB);
        }
        if (colliderA.type === 'ellipse' && colliderB.type === 'ellipse') {
            return this.checkEllipseCollision(colliderA, colliderB);
        }
        if (colliderA.type === 'circle' && colliderB.type === 'circle') {
            return this.checkCircleCollision(colliderA, colliderB);
        }
        // Можно добавить проверки box-circle, ellipse-circle и т.д. при необходимости
        return false;
    }
}