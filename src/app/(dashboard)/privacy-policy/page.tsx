// src/app/(dashboard)/privacy-policy/page.tsx

import { FaShieldAlt, FaUserShield, FaLock, FaDatabase } from 'react-icons/fa';

import styles from './PrivacyPolicy.module.css';

import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <div className={styles.page}>
      {/* ===== Header (layout padrão Subjects/Students/ClassRooms/Enrollments) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaShieldAlt className={styles.titleIcon} />
            </span>
            Política de Privacidade
          </h1>

          <p className={styles.subtitle}>
            Como o painel de gestão escolar trata, organiza e protege os dados
            de alunos, professores, matrículas e salas.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Badge variant="info">Ambiente de demonstração</Badge>
          <Badge variant="soft">Somente dados fictícios</Badge>
        </div>
      </header>

      {/* ===== Conteúdo principal ===== */}
      <section className={styles.contentGrid}>
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <FaUserShield className={styles.cardIcon} />
            <div>
              <h2 className={styles.cardTitle}>1. Visão geral</h2>
              <p className={styles.cardSubtitle}>
                Entenda o objetivo desta política dentro do contexto do painel
                administrativo.
              </p>
            </div>
          </div>

          <div className={styles.cardBody}>
            <p className={styles.paragraph}>
              Este projeto de gestão escolar foi construído como um ambiente de
              demonstração para estudo de arquitetura frontend, boas práticas de
              UI/UX e organização de domínio acadêmico (alunos, professores,
              disciplinas, salas e matrículas).
            </p>
            <p className={styles.paragraph}>
              Aqui, nenhum dado real de instituição, aluno ou professor é
              utilizado. Todas as informações manipuladas pelo sistema são mocks
              em memória ou dados genéricos de teste, com o objetivo exclusivo
              de simular cenários reais de secretaria e coordenação escolar.
            </p>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <FaDatabase className={styles.cardIcon} />
            <div>
              <h2 className={styles.cardTitle}>2. Dados trabalhados no painel</h2>
              <p className={styles.cardSubtitle}>
                Quais tipos de informações são manipuladas pelo sistema.
              </p>
            </div>
          </div>

          <div className={styles.cardBody}>
            <ul className={styles.list}>
              <li>
                <span className={styles.listLabel}>Alunos:</span>
                <span className={styles.listValue}>
                  nome, e-mail, telefone, endereço e número de matrícula
                  fictício.
                </span>
              </li>
              <li>
                <span className={styles.listLabel}>Professores:</span>
                <span className={styles.listValue}>
                  nome, e-mail, disciplinas associadas e dados básicos de
                  contato.
                </span>
              </li>
              <li>
                <span className={styles.listLabel}>Disciplinas:</span>
                <span className={styles.listValue}>
                  nome da disciplina, descrição, carga horária e vínculo com
                  professores.
                </span>
              </li>
              <li>
                <span className={styles.listLabel}>Salas:</span>
                <span className={styles.listValue}>
                  código da sala, capacidade, horário e professor titular.
                </span>
              </li>
              <li>
                <span className={styles.listLabel}>Matrículas:</span>
                <span className={styles.listValue}>
                  relação entre aluno e sala, data de matrícula e status (ativa,
                  trancada, concluída, etc.).
                </span>
              </li>
            </ul>

            <p className={styles.paragraph}>
              Em um ambiente de produção, esses dados seriam armazenados em um
              backend seguro, com autenticação, camadas de autorização e trilhas
              de auditoria. Nesta versão, os dados são mantidos apenas em
              memória, via Providers de contexto, para fins de protótipo.
            </p>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <FaLock className={styles.cardIcon} />
            <div>
              <h2 className={styles.cardTitle}>3. Autenticação e acesso</h2>
              <p className={styles.cardSubtitle}>
                Como o acesso ao painel é controlado nesta aplicação.
              </p>
            </div>
          </div>

          <div className={styles.cardBody}>
            <p className={styles.paragraph}>
              O painel utiliza autenticação baseada em Firebase Auth
              (e-mail/senha e provedores sociais) para simular um cenário real
              de login administrativo. O objetivo é demonstrar como proteger as
              rotas do dashboard e organizar o fluxo de sessão.
            </p>
            <p className={styles.paragraph}>
              Em um projeto real, é recomendado complementar a autenticação com:
            </p>

            <ul className={styles.bulletList}>
              <li>
                camadas de autorização por perfil (secretaria, coordenação,
                direção);
              </li>
              <li>
                controle de permissões por módulo (alunos, professores,
                matrículas etc.);
              </li>
              <li>
                registro de atividade (quem criou, editou ou inativou
                registros);
              </li>
              <li>
                políticas de senha forte e múltiplos fatores de autenticação.
              </li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <FaShieldAlt className={styles.cardIcon} />
            <div>
              <h2 className={styles.cardTitle}>4. Boas práticas recomendadas</h2>
              <p className={styles.cardSubtitle}>
                Diretrizes para evolução deste protótipo em um sistema pronto
                para produção.
              </p>
            </div>
          </div>

          <div className={styles.cardBody}>
            <ul className={styles.bulletList}>
              <li>
                Encriptar dados sensíveis em repouso (bancos de dados) e em
                trânsito (HTTPS).
              </li>
              <li>
                Separar ambientes de desenvolvimento, homologação e produção com
                bases de dados distintas.
              </li>
              <li>
                Implementar rotinas de backup, logs de auditoria e trilhas de
                acesso.
              </li>
              <li>
                Adequar o armazenamento de dados às legislações vigentes (como
                LGPD), especialmente no contexto escolar.
              </li>
              <li>
                Manter políticas claras de retenção de dados (por quanto tempo
                matrículas, históricos e cadastros permanecem ativos ou
                arquivados).
              </li>
            </ul>

            <p className={styles.paragraph}>
              Este módulo de política de privacidade foi pensado para mostrar
              que, mesmo em protótipos, já é possível comunicar intenções de
              segurança, organização de dados e responsabilidade com informações
              acadêmicas.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
